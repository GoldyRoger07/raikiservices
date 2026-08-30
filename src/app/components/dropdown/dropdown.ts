import { Component, input } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';
import { RouterLink } from '@angular/router';




@Component({
  selector: 'my-dropdown',
  imports: [RouterLink],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown {
  label = input('Le Groupe')
  items = input<LinkItem[]>([
    {
      label: 'Vision',
      url: '/vision'
    },
    {
      label: 'Programme',
      url: '/programme'
    },
    {
      label: 'A propos',
      url: '/a-propos'
    },
    {
      label: 'Organigramme',
      url: '/organigramme'
    }
  ])

  // Stocke le libellé du dropdown ouvert sur mobile
  openDropdownLabel: string | null = null;


  // Alterne l'affichage d'un sous-menu au clic (mobile uniquement)
  toggleDropdown(label: string, event: Event) {
    // Empêche le comportement par défaut si nécessaire
    event.preventDefault();
    
    if (this.openDropdownLabel === label) {
      this.openDropdownLabel = null; // Referme si déjà ouvert
    } else {
      this.openDropdownLabel = label; // Ouvre le nouveau
    }
  }
}
