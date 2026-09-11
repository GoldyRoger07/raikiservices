import { Component, OnInit, inject, signal } from '@angular/core';

import { Container } from '../../../components/container/container';
import { CtaSection } from '../../../components/cta-section/cta-section';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { HeroSection } from '../../../components/hero-section/hero-section';
import { ProjectCard } from '../../../components/project-card/project-card';
import { SeparatorDesign } from '../../../components/separator-design/separator-design';
import { pageSeo } from '../../../config/content/seo-pages';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { SeoService } from '../../../services/seo.service';

/**
 * Réalisations à voir en un coup d'œil.
 *
 * <p>Toutes sont affichées d'un bloc, sans pagination : une vitrine se parcourt du regard,
 * et le nombre de réalisations d'une agence reste de l'ordre de la dizaine. Le plafond est
 * fixé haut pour qu'il ne se fasse pas sentir avant longtemps.
 *
 * <p>La page est rendue côté serveur (voir `app.routes.server.ts`) et non pré-rendue : le
 * pré-rendu figerait la vitrine dans le bundle, et publier depuis le back-office ne
 * changerait rien avant le déploiement suivant.
 */
@Component({
  selector: 'app-portfolio',
  imports: [Header, Footer, HeroSection, CtaSection, Container, SeparatorDesign, ProjectCard],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export default class Portfolio implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly projects = inject(ProjectService);

  protected readonly items = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);

  ngOnInit(): void {
    this.seo.update(pageSeo.portfolio);

    this.projects.listPublished({ page: 0, size: 48 }).subscribe({
      next: (page) => {
        this.items.set(page.content);
        this.loading.set(false);
      },
      // L'API indisponible ne doit pas laisser une page à moitié rendue : on le dit
      // simplement, le reste de la page — bannière, appel à l'action — tient debout seul.
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }
}
