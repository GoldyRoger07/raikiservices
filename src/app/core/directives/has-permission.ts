import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { AuthService } from '../services/auth.service';

/**
 * Affiche son contenu uniquement si le compte connecté porte la permission demandée.
 *
 * <p>Sert à masquer les actions inaccessibles — un bouton « Supprimer » sans `DELETE_USER`.
 * C'est une commodité d'interface : le backend reste seul juge, un appel lancé malgré tout
 * repart en 403.
 *
 * @example
 * <button *appHasPermission="'DELETE_USER'">Supprimer</button>
 * <button *appHasPermission="['CREATE_ROLE', 'UPDATE_ROLE']">Gérer</button>
 */
@Directive({ selector: '[appHasPermission]' })
export class HasPermission {
  private readonly auth = inject(AuthService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);

  /** Une permission, ou une liste dont une seule suffit. */
  readonly appHasPermission = input.required<string | readonly string[]>();

  private rendered = false;

  constructor() {
    effect(() => {
      const required = this.appHasPermission();
      const granted = this.auth.hasAny(typeof required === 'string' ? [required] : required);

      if (granted && !this.rendered) {
        this.container.createEmbeddedView(this.template);
        this.rendered = true;
      } else if (!granted && this.rendered) {
        this.container.clear();
        this.rendered = false;
      }
    });
  }
}
