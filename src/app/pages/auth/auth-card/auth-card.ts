import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CompanyService } from '../../../services/company.service';

/**
 * Cadre visuel commun aux écrans d'authentification : logo, titre, sous-titre, contenu.
 *
 * <p>Les trois pages du parcours (connexion, mot de passe oublié, réinitialisation) partagent
 * la même mise en page ; seul leur formulaire change, projeté ici.
 */
@Component({
  selector: 'app-auth-card',
  imports: [RouterLink],
  templateUrl: './auth-card.html',
  styleUrl: './auth-card.css',
})
export class AuthCard {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');

  protected readonly company = inject(CompanyService).company;
}
