import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Container } from '../../../components/container/container';
import { CtaSection } from '../../../components/cta-section/cta-section';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { SeparatorDesign } from '../../../components/separator-design/separator-design';
import { seoConfig } from '../../../config/seo';
import { BlogPost } from '../../../core/models/blog.model';
import { BlogService } from '../../../core/services/blog.service';
import { SeoService } from '../../../services/seo.service';
import { formatFrenchDate, looksLikeHtml, readingTime, toParagraphs } from '../blog-content';

/** Nombre d'articles proposés en bas de page pour poursuivre la lecture. */
const RELATED_COUNT = 3;

/** Identifiant du `<script>` de données structurées, pour le retrouver et le retirer. */
const JSON_LD_ID = 'blog-article-jsonld';

/**
 * Article public : `/blog/:slug`.
 *
 * <p>L'article est chargé depuis `/public/v1/blog/:slug`, qui ne connaît que les articles
 * publiés — un brouillon répond 404 ici, et la page affiche alors le même message qu'une
 * adresse inventée.
 *
 * <p>Le composant est réutilisé quand on passe d'un article à l'autre par les suggestions de
 * bas de page : d'où l'abonnement au `paramMap` plutôt qu'une lecture du `snapshot`.
 */
@Component({
  selector: 'app-blog-article',
  imports: [Header, Footer, CtaSection, Container, SeparatorDesign, RouterLink],
  templateUrl: './blog-article.html',
  styleUrl: './blog-article.css',
})
export default class BlogArticle implements OnInit, OnDestroy {
  private readonly blog = inject(BlogService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  // `ngOnInit` n'est pas un contexte d'injection : `takeUntilDestroyed` a besoin du `DestroyRef`.
  private readonly destroyRef = inject(DestroyRef);

  protected readonly post = signal<BlogPost | null>(null);
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);

  /** Suggestions de lecture ; silencieusement vides si l'appel échoue. */
  protected readonly related = signal<BlogPost[]>([]);

  /**
   * Le corps est enregistré tel quel par le back-office : du HTML est injecté via
   * `[innerHTML]` (Angular l'assainit et retire scripts et gestionnaires d'événements), du
   * texte brut est découpé en paragraphes et interpolé, donc échappé.
   */
  protected readonly isHtml = computed(() => looksLikeHtml(this.post()?.content));
  protected readonly paragraphs = computed(() =>
    this.isHtml() ? [] : toParagraphs(this.post()?.content),
  );

  protected readonly readingMinutes = computed(() => readingTime(this.post()?.content));

  protected readonly formatDate = formatFrenchDate;

  /** Lignes grises affichées le temps du chargement, pour ne pas faire sauter la mise en page. */
  protected readonly skeletonLines = [1, 2, 3, 4, 5, 6, 7, 8];

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.load(slug);
    });
  }

  ngOnDestroy(): void {
    this.removeJsonLd();
  }

  private load(slug: string): void {
    this.loading.set(true);
    this.notFound.set(false);
    this.post.set(null);
    this.related.set([]);
    this.removeJsonLd();

    this.blog.getPublishedBySlug(slug).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
        this.applySeo(post);
        this.loadRelated(post);
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
        // Une adresse d'article inconnue ne doit pas finir dans l'index des moteurs.
        this.seo.update({
          title: 'Article introuvable | RaikiServices',
          description: "Cet article n'existe pas ou n'est plus publié.",
          path: `/blog/${slug}`,
          noindex: true,
        });
      },
    });
  }

  /**
   * Articles récents, moins celui qu'on lit.
   *
   * <p>L'API publique n'expose pas de « related » : on reprend simplement les derniers
   * publiés, ce qui reste pertinent sur un blog de cette taille.
   */
  private loadRelated(post: BlogPost): void {
    this.blog.listPublished({ page: 0, size: RELATED_COUNT + 1 }).subscribe({
      next: (page) =>
        this.related.set(
          page.content.filter((other) => other.id !== post.id).slice(0, RELATED_COUNT),
        ),
      error: () => this.related.set([]),
    });
  }

  // ──────────────── Métadonnées ────────────────

  private applySeo(post: BlogPost): void {
    const description =
      post.excerpt?.trim() ||
      `${post.title} — un article du blog RaikiServices sur la création de sites web et le référencement.`;

    this.seo.update({
      title: `${post.title} | Blog RaikiServices`,
      description,
      path: `/blog/${post.slug}`,
      image: post.coverImage ?? undefined,
      type: 'article',
    });

    this.setJsonLd(post, description);
  }

  /**
   * Données structurées `BlogPosting`.
   *
   * <p>Elles disent aux moteurs qu'il s'agit d'un article — titre, dates, auteur, image — et
   * ouvrent l'accès aux affichages enrichis. `SeoService` ne gère que les balises `<meta>`,
   * ce bloc est donc posé ici, et retiré au départ de la page pour qu'il ne survive pas à une
   * navigation vers une autre page du site.
   */
  private setJsonLd(post: BlogPost, description: string): void {
    const base = seoConfig.baseUrl.replace(/\/$/, '');
    const payload = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description,
      image: post.coverImage ? [absolute(post.coverImage, base)] : undefined,
      datePublished: post.publishedAt ?? post.createdAt,
      dateModified: post.updatedAt,
      author: post.authorName
        ? { '@type': 'Person', name: post.authorName }
        : { '@type': 'Organization', name: seoConfig.siteName },
      publisher: { '@type': 'Organization', name: seoConfig.siteName },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${base}/blog/${post.slug}` },
      keywords: post.tags?.length ? post.tags.join(', ') : undefined,
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

/** Transforme un chemin racine en URL absolue ; laisse passer une URL déjà complète. */
function absolute(pathOrUrl: string, base: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return `${base}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}
