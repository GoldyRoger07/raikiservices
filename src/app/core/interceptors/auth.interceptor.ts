import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/** Endpoints du parcours d'authentification : ils ne doivent jamais déclencher de rejeu. */
const AUTH_ENDPOINTS = ['/api/v1/auth/login', '/api/v1/auth/refresh', '/api/v1/auth/logout'];

/**
 * Rafraîchissement partagé par toutes les requêtes.
 *
 * <p>Sans ce garde, plusieurs 401 simultanés déclencheraient chacun leur propre appel à
 * `/refresh`. La rotation du refresh token tournerait alors plusieurs fois en parallèle et
 * invaliderait la session au lieu de la prolonger.
 */
let refreshInFlight = false;
const refreshedToken = new BehaviorSubject<string | null>(null);

/**
 * Attache l'access token aux appels vers l'API et rejoue une fois la requête après
 * rafraîchissement quand le backend répond 401.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(environment.apiUrl)) {
    return next(request);
  }

  const auth = inject(AuthService);
  const router = inject(Router);

  return next(withAccessToken(request, auth.accessToken())).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      const isAuthCall = AUTH_ENDPOINTS.some((endpoint) => request.url.includes(endpoint));

      if (!isUnauthorized || isAuthCall) {
        return throwError(() => error);
      }
      return retryAfterRefresh(request, next, auth, router);
    }),
  );
};

/**
 * Le cookie de refresh est limité au chemin `/api/v1/auth` : seuls ces appels ont besoin de
 * `withCredentials`. Les autres n'emportent que le jeton d'accès.
 */
function withAccessToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  const needsCookie = request.url.includes('/api/v1/auth');
  if (!token) {
    return needsCookie ? request.clone({ withCredentials: true }) : request;
  }
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
    withCredentials: needsCookie || request.withCredentials,
  });
}

function retryAfterRefresh(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (refreshInFlight) {
    // Un rafraîchissement est déjà en cours : on attend son jeton avant de rejouer.
    return refreshedToken.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => next(withAccessToken(request, token))),
    );
  }

  refreshInFlight = true;
  refreshedToken.next(null);

  return auth.refresh().pipe(
    switchMap((response) => {
      refreshInFlight = false;
      refreshedToken.next(response.accessToken);
      return next(withAccessToken(request, response.accessToken));
    }),
    catchError((refreshError: unknown) => {
      // Refresh expiré ou session révoquée : la session est perdue. On renvoie au formulaire
      // de connexion en gardant l'URL demandée pour y revenir une fois authentifié.
      refreshInFlight = false;
      auth.clearSession();
      void router.navigate(['/login'], { queryParams: { redirect: router.url } });
      return throwError(() => refreshError);
    }),
  );
}
