import { Component, input } from '@angular/core';

import { Container } from '../container/container';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { HeroSection } from '../hero-section/hero-section';
import { SeparatorDesign } from '../separator-design/separator-design';
import { LegalDocument } from '../../models/legal.model';

/**
 * Mise en page commune aux quatre pages légales.
 *
 * <p>Elles partagent exactement la même structure — bannière, sommaire, sections numérotées —
 * et ne diffèrent que par leur contenu, décrit dans `config/content/legal.ts`. Les pages
 * elles-mêmes se réduisent donc à leur appel SEO et au document à afficher.
 */
@Component({
  selector: 'my-legal-page',
  imports: [Header, Footer, HeroSection, Container, SeparatorDesign],
  templateUrl: './legal-page.html',
  styleUrl: './legal-page.css',
})
export class LegalPage {
  readonly document = input.required<LegalDocument>();

  /** Ancre d'une section, dérivée de son rang : le sommaire y renvoie. */
  protected anchor(index: number): string {
    return `section-${index + 1}`;
  }
}
