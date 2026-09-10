import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

/**
 * Réserve une route aux comptes connectés.
 *
 * <p>Au premier chargement d'une URL du back-office, aucune session n'est encore en mémoire :
 * le garde tente d'abord de la reprendre depuis le cookie de refresh. La restauration n'est
 * tentée qu'une fois — {@link AuthService.restoreSession} répond ensuite immédiatement.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return auth
    .restoreSession()
    .pipe(
      map(
        (restored) =>
          restored || router.createUrlTree(['/login'], { queryParams: { redirect: state.url } }),
      ),
    );
};

/**
 * Inverse du précédent : renvoie au back-office un compte déjà connecté qui ouvrirait le
 * formulaire de connexion.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/admin']);
  }

  return auth.restoreSession().pipe(map((restored) => !restored || router.createUrlTree(['/admin'])));
};
