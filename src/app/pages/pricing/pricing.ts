import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Container } from '../../components/container/container';
import { CtaSection } from '../../components/cta-section/cta-section';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { HeroSection } from '../../components/hero-section/hero-section';
import { SeparatorDesign } from '../../components/separator-design/separator-design';
import {
  launchOffer,
  monthlyIncludes,
  pricingFaq,
  pricingPlans,
  standardOffer,
} from '../../config/content/pricing';
import { pageSeo } from '../../config/content/seo-pages';
import { LaunchOfferState } from '../../core/models/launch-offer.model';
import { LaunchOfferService } from '../../core/services/launch-offer.service';
import { SeoService } from '../../services/seo.service';

/**
 * Page des tarifs.
 *
 * <p>Un modèle en deux temps : un paiement à la création, puis un abonnement mensuel qui
 * maintient le site en ligne. Les deux montants sont annoncés dès la carte — le mensuel
 * étant obligatoire, le cacher jusqu'au devis ne ferait que déplacer la mauvaise surprise.
 *
 * <p>Le haut de page bascule entre deux blocs : l'offre de lancement tant qu'il reste des
 * places, et un état des lieux gratuit ensuite. Le compteur vit en base et se règle depuis
 * le back-office, d'où le rendu serveur de cette page (voir `app.routes.server.ts`) : la
 * pré-rendre figerait « il reste 10 places » jusqu'au déploiement suivant.
 *
 * <p>Si l'API ne répond pas, c'est le bloc de repli qui s'affiche. Mieux vaut ne pas
 * annoncer une offre qu'en annoncer une qu'on ne peut pas honorer.
 */
@Component({
  selector: 'app-pricing',
  imports: [Header, Footer, HeroSection, CtaSection, Container, SeparatorDesign, RouterLink],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export default class Pricing implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly offers = inject(LaunchOfferService);

  protected readonly plans = pricingPlans;
  protected readonly includes = monthlyIncludes;
  protected readonly faq = pricingFaq;
  protected readonly launch = launchOffer;
  protected readonly standard = standardOffer;

  protected readonly offerState = signal<LaunchOfferState | null>(null);

  /** Vrai seulement si le backend confirme qu'il reste des places. */
  protected readonly offerRunning = computed(() => this.offerState()?.running === true);

  protected readonly slotsLabel = computed(() => {
    const state = this.offerState();
    return state ? launchOffer.slotsLabel(state.remainingSlots, state.totalSlots) : '';
  });

  /** Question dépliée dans la FAQ ; `null` quand toutes sont fermées. */
  protected readonly openQuestion = signal<number | null>(0);

  ngOnInit(): void {
    this.seo.update(pageSeo.pricing);

    this.offers.getPublic().subscribe({
      next: (state) => this.offerState.set(state),
      error: () => this.offerState.set(null),
    });
  }

  protected toggleQuestion(index: number): void {
    this.openQuestion.update((current) => (current === index ? null : index));
  }

  /**
   * Paramètres du lien vers le formulaire de contact.
   *
   * <p>Le sujet est prérempli pour distinguer d'un coup d'œil, dans le back-office, une
   * candidature à l'offre d'une demande ordinaire.
   */
  protected contactParams(subject: string): Record<string, string> {
    return { sujet: subject };
  }
}
