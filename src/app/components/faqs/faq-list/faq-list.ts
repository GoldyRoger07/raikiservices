import { Component, Input, signal } from '@angular/core';

import { FaqEntry } from '../../../models/faq.model';
import { AnimateOnScrollDirective } from '../../../directives/animate-on-scroll';
import { FaqItem } from '../faq-item/faq-item';

/**
 * Accordéon de questions fréquentes : une seule ouverte à la fois.
 *
 * <p>Ne porte que le comportement. L'habillage de section — séparateur, titre, chapô,
 * données structurées — est celui de `faq-section`, qui enveloppe cette liste : les pages
 * passent par lui, pas par elle.
 */
@Component({
  selector: 'faq-list',
  imports: [FaqItem, AnimateOnScrollDirective],
  templateUrl: './faq-list.html',
  styleUrl: './faq-list.css',
})
export class FaqList {
  /** Index de la question ouverte ; `-1` quand toutes sont fermées. */
  openIndex = signal<number>(-1);

  /** Aucune valeur par défaut : une FAQ sans contenu propre à la page n'a pas de sens. */
  @Input({ required: true }) faqs: FaqEntry[] = [];

  handleToggle(index: number): void {
    // Un second clic sur la question ouverte la referme.
    this.openIndex.set(this.openIndex() === index ? -1 : index);
  }
}
