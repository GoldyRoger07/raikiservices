import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';

import { Container } from '../../container/container';
import { SeparatorDesign } from '../../separator-design/separator-design';
import { FaqEntry } from '../../../models/faq.model';
import { SeoService } from '../../../services/seo.service';
import { FaqList } from '../faq-list/faq-list';

/**
 * Bloc « questions fréquentes » posé en bas des pages du site vitrine.
 *
 * <p>Un seul composant pour toutes les pages : le contenu vient de `config/content/faq.ts`
 * (et de `pricingFaq` pour les tarifs), l'habillage est ici. C'est ce qui évite qu'une page
 * se retrouve avec un accordéon dessiné autrement que ses voisines, comme c'était le cas
 * tant que la page des tarifs portait le sien dans son propre gabarit.
 *
 * <p>Il déclare aussi les données structurées FAQPage de la page (voir `SeoService.setFaq`).
 * D'où la règle : un seul bloc de ce type par page — deux en poseraient deux, et le second
 * écraserait le premier.
 */
@Component({
  selector: 'faq-section',
  imports: [Container, SeparatorDesign, FaqList],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.css',
})
export class FaqSection implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);

  /** Les questions de la page. */
  readonly items = input.required<FaqEntry[]>();

  readonly eyebrow = input<string>('Questions fréquentes');
  readonly title = input<string>('Vos questions');

  /** Chapô facultatif, sous le titre. */
  readonly intro = input<string>('');

  /**
   * Classes de fond de la section, pour alterner avec le bloc qui précède.
   *
   * <p>Écrites en toutes lettres par les pages (`bg-gray-50`) et jamais composées : Tailwind
   * n'analyse que du texte, et une classe assemblée à l'exécution ne produirait aucune règle.
   */
  readonly background = input<string>('');

  ngOnInit(): void {
    this.seo.setFaq(this.items());
  }

  ngOnDestroy(): void {
    // Sans cela, le balisage suivrait le visiteur sur la page suivante lors d'une navigation
    // côté navigateur, et décrirait une FAQ qui ne s'y trouve pas.
    this.seo.clearFaq();
  }
}
