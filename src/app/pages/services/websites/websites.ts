import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Container } from '../../../components/container/container';
import { CtaSection } from '../../../components/cta-section/cta-section';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { HeroSection } from '../../../components/hero-section/hero-section';
import { SeparatorDesign } from '../../../components/separator-design/separator-design';
import { pageSeo } from '../../../config/content/seo-pages';
import { servicePricingNote, websiteServices } from '../../../config/content/services';
import { SeoService } from '../../../services/seo.service';

/**
 * Ce que nous construisons : `/sites-web`.
 *
 * <p>La page décrit les types de sites ; elle rappelle aussi le modèle — création puis
 * abonnement — et renvoie aux tarifs. Une page de service qui ne parle jamais d'argent
 * laisse le visiteur découvrir l'abonnement au moment du devis, c'est-à-dire au pire moment.
 */
@Component({
  selector: 'app-websites',
  imports: [Header, Footer, HeroSection, Container, SeparatorDesign, CtaSection, RouterLink],
  templateUrl: './websites.html',
  styleUrl: './websites.css',
})
export default class Websites implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly cards = websiteServices;
  protected readonly pricingNote = servicePricingNote;

  ngOnInit(): void {
    this.seo.update(pageSeo.websites);
  }
}
