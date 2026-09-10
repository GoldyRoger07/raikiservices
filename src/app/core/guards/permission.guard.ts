import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

/**
 * Réserve une route aux comptes portant au moins une des permissions indiquées.
 *
 * <p>Ce contrôle n'est qu'un confort d'affichage : la décision qui fait foi reste celle des
 * `@PreAuthorize` du backend, qui refuse la donnée même si l'écran s'ouvre.
 *
 * @example
 * { path: 'users', canActivate: [authGuard, hasPermission('READ_USER')], ... }
 */
export function hasPermission(...permissions: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const allow = () =>
      auth.hasAny(permissions) ? true : router.createUrlTree(['/admin/acces-refuse']);

    if (auth.ready()) {
      return allow();
    }
    // Accès direct à l'URL : les permissions n'arrivent qu'avec la session restaurée.
    return auth.restoreSession().pipe(map(allow));
  };
}
