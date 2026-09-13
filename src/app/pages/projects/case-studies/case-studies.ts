import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Container } from '../../../components/container/container';
import { CtaSection } from '../../../components/cta-section/cta-section';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { HeroSection } from '../../../components/hero-section/hero-section';
import { SeparatorDesign } from '../../../components/separator-design/separator-design';
import { pageSeo } from '../../../config/content/seo-pages';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import {
  IMAGEKIT_CARD_SIZES,
  imagekitSrcset,
  imagekitUrl,
} from '../../../core/utils/imagekit';
import { SeoService } from '../../../services/seo.service';

/**
 * Études de cas : les réalisations racontées en détail.
 *
 * <p>Seule liste publique à porter la description complète de chaque projet — la page
 * l'affiche telle quelle, sans page de détail intermédiaire. C'est pourquoi elle appelle
 * `listCaseStudies` et non `listPublished`, qui n'en renvoie qu'un résumé.
 */
@Component({
  selector: 'app-case-studies',
  imports: [Header, Footer, HeroSection, CtaSection, Container, SeparatorDesign, RouterLink],
  templateUrl: './case-studies.html',
  styleUrl: './case-studies.css',
})
export default class CaseStudies implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly projects = inject(ProjectService);

  protected readonly items = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);

  protected readonly sizes = IMAGEKIT_CARD_SIZES;
  protected readonly cover = (project: Project) => imagekitUrl(project.coverPublicId, 800);
  protected readonly coverSrcset = (project: Project) => imagekitSrcset(project.coverPublicId);

  ngOnInit(): void {
    this.seo.update(pageSeo.caseStudies);

    this.projects.listCaseStudies({ page: 0, size: 20 }).subscribe({
      next: (page) => {
        this.items.set(page.content);
        this.loading.set(false);
      },
      // L'API indisponible ne doit pas laisser une page à moitié rendue : le reste — la
      // bannière, l'appel à l'action — tient debout seul.
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }
}
