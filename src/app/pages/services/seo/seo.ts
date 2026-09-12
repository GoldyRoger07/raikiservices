import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Container } from '../../../components/container/container';
import { CtaSection } from '../../../components/cta-section/cta-section';
import { FaqSection } from '../../../components/faqs/faq-section/faq-section';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { HeroSection } from '../../../components/hero-section/hero-section';
import { SeparatorDesign } from '../../../components/separator-design/separator-design';
import { seoFaq } from '../../../config/content/faq';
import { pageSeo } from '../../../config/content/seo-pages';
import { coverageLabels, seoServices, servicePricingNote } from '../../../config/content/services';
import { SeoService } from '../../../services/seo.service';

/**
 * Référencement : `/seo`.
 *
 * <p>Chaque prestation porte son rattachement à l'offre — comprise dans telle formule, ou
 * accompagnement séparé. Sans cette mention, la page promettait du netlinking et de la
 * rédaction qu'aucune formule ne comprend, et le devis démentait la page.
 */
@Component({
  selector: 'app-seo',
  imports: [
    Header,
    Footer,
    HeroSection,
    Container,
    SeparatorDesign,
    CtaSection,
    FaqSection,
    RouterLink,
  ],
  templateUrl: './seo.html',
  styleUrl: './seo.css',
})
export default class Seo implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly cards = seoServices;
  protected readonly coverage = coverageLabels;
  protected readonly pricingNote = servicePricingNote;
  protected readonly faq = seoFaq;

  ngOnInit(): void {
    this.seo.update(pageSeo.seo);
  }
}
