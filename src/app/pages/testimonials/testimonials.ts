import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';

import { Container } from '../../components/container/container';
import { CtaSection } from '../../components/cta-section/cta-section';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { HeroSection } from '../../components/hero-section/hero-section';
import { SeparatorDesign } from '../../components/separator-design/separator-design';
import { TestimonialCard } from '../../components/testimonial-card/testimonial-card';
import { pageSeo } from '../../config/content/seo-pages';
import { seoConfig } from '../../config/seo';
import { Testimonial, TestimonialSummary } from '../../core/models/testimonial.model';
import { TestimonialService } from '../../core/services/testimonial.service';
import { SeoService } from '../../services/seo.service';

/** Identifiant du `<script>` de données structurées, pour le retrouver et le retirer. */
const JSON_LD_ID = 'testimonials-jsonld';

/**
 * Témoignages clients : `/temoignages`.
 *
 * <p>Tous affichés d'un bloc, comme le portfolio : une agence en compte quelques dizaines
 * au plus, et une page d'avis se parcourt du regard.
 *
 * <p>Rendue côté serveur et non pré-rendue (voir `app.routes.server.ts`) : publier un
 * témoignage depuis le back-office doit se voir sans redéployer.
 */
@Component({
  selector: 'app-testimonials',
  imports: [Header, Footer, HeroSection, CtaSection, Container, SeparatorDesign, TestimonialCard],
  templateUrl: './testimonials.html',
})
export default class Testimonials implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly testimonials = inject(TestimonialService);
  private readonly document = inject(DOCUMENT);

  protected readonly items = signal<Testimonial[]>([]);
  protected readonly summary = signal<TestimonialSummary | null>(null);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);

  ngOnInit(): void {
    this.seo.update(pageSeo.testimonials);

    this.testimonials.listPublished({ page: 0, size: 60 }).subscribe({
      next: (page) => {
        this.items.set(page.content);
        this.loading.set(false);
        this.setJsonLd();
      },
      // L'API indisponible ne casse pas la page : on le dit, le reste tient debout seul.
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });

    this.testimonials.summary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.setJsonLd();
      },
      error: () => this.summary.set(null),
    });
  }

  ngOnDestroy(): void {
    this.removeJsonLd();
  }

  /** « 4,9 » plutôt que « 4.9 ». */
  protected formatRating(value: number): string {
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  /**
   * Données structurées `Organization` portant les avis et leur note moyenne.
   *
   * <p>Google n'affiche pas d'étoiles dans ses résultats pour les avis qu'une entreprise
   * publie sur elle-même : le balisage ne promet donc pas de résultat enrichi. Il reste
   * exact, et décrit aux moteurs ce que la page contient. Posé à chaque réponse — la liste
   * et le résumé arrivent séparément —, et retiré au départ de la page.
   */
  private setJsonLd(): void {
    const items = this.items();
    if (!items.length) {
      return;
    }

    const base = seoConfig.baseUrl.replace(/\/$/, '');
    const summary = this.summary();

    const payload = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: seoConfig.siteName,
      url: base,
      aggregateRating:
        summary?.averageRating != null && summary.ratedCount > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue: summary.averageRating,
              reviewCount: summary.ratedCount,
              bestRating: 5,
              worstRating: 1,
            }
          : undefined,
      review: items.map((item) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: item.authorName },
        reviewBody: item.content,
        datePublished: item.publishedAt ?? item.createdAt,
        reviewRating: item.rating
          ? { '@type': 'Rating', ratingValue: item.rating, bestRating: 5, worstRating: 1 }
          : undefined,
      })),
    };

    this.removeJsonLd();
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(payload);
    this.document.head.appendChild(script);
  }

  private removeJsonLd(): void {
    this.document.head.querySelector(`#${JSON_LD_ID}`)?.remove();
  }
}
