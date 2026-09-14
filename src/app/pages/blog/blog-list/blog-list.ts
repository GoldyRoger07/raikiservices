import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Container } from '../../../components/container/container';
import { CtaSection } from '../../../components/cta-section/cta-section';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { HeroSection } from '../../../components/hero-section/hero-section';
import { SeparatorDesign } from '../../../components/separator-design/separator-design';
import { pageSeo } from '../../../config/content/seo-pages';
import { BlogPost } from '../../../core/models/blog.model';
import { BlogService } from '../../../core/services/blog.service';
import { apiErrorMessage } from '../../../core/utils/http.util';
import { IMAGEKIT_CARD_SIZES, imagekitSrcset, imagekitUrl } from '../../../core/utils/imagekit';
import { SeoService } from '../../../services/seo.service';
import { formatFrenchDate } from '../blog-content';

/** Articles par page. Trois rangées de trois sur grand écran. */
const PAGE_SIZE = 9;

/** Ancre posée sur la liste, pour y revenir après une recherche ou un changement de page. */
const ARTICLES_ANCHOR = 'articles';

/**
 * Liste publique des articles : `/blog`.
 *
 * <p>Elle n'appelle que `/public/v1/blog`, qui ne renvoie que les articles publiés et ne
 * demande aucune authentification — la page est donc rendue côté serveur (voir
 * `app.routes.server.ts`) et son HTML part complet aux moteurs de recherche.
 *
 * <p>La page courante et la recherche vivent dans l'URL (`?page=2&q=seo`) : chaque page de
 * la liste a ainsi sa propre adresse, partageable et indexable. Le composant est réutilisé
 * d'une page à l'autre, d'où l'abonnement aux `queryParamMap` plutôt qu'une lecture du
 * `snapshot`, qui ne changerait plus après le premier affichage.
 */
@Component({
  selector: 'app-blog-list',
  imports: [
    Header,
    Footer,
    HeroSection,
    CtaSection,
    Container,
    SeparatorDesign,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export default class BlogList implements OnInit {
  private readonly blog = inject(BlogService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  // `ngOnInit` n'est pas un contexte d'injection : `takeUntilDestroyed` a besoin du `DestroyRef`.
  private readonly destroyRef = inject(DestroyRef);

  protected readonly posts = signal<BlogPost[]>([]);
  protected readonly loading = signal(true);

  /** Couvertures : chemin ImageKit, ou adresse historique laissée telle quelle. */
  protected readonly coverUrl = (source: string | null, width: number) => imagekitUrl(source, width);
  protected readonly srcsetOf = (source: string | null) => imagekitSrcset(source);
  protected readonly cardSizes = IMAGEKIT_CARD_SIZES;
  protected readonly error = signal('');

  /** Page courante, comptée à partir de 0 comme côté backend. */
  protected readonly page = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly totalElements = signal(0);

  /** Terme envoyé au backend (`globalFilter`), tel qu'il figure dans l'URL. */
  protected readonly query = signal('');
  /** Contenu du champ de recherche, tant que la recherche n'a pas été lancée. */
  protected searchInput = '';

  /**
   * Le premier article de la première page est mis en avant sur toute la largeur — sauf
   * pendant une recherche, où tous les résultats se valent.
   */
  protected readonly featured = computed(() =>
    this.page() === 0 && !this.query() ? (this.posts()[0] ?? null) : null,
  );

  protected readonly rest = computed(() =>
    this.featured() ? this.posts().slice(1) : this.posts(),
  );

  /** Numéros de page pour la navigation du bas, comptés à partir de 0. */
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index),
  );

  protected readonly formatDate = formatFrenchDate;

  /** Cartes grises affichées le temps du chargement, pour ne pas faire sauter la mise en page. */
  protected readonly skeletons = [1, 2, 3, 4, 5, 6];

  protected readonly articlesAnchor = ARTICLES_ANCHOR;

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      // L'URL affiche des pages numérotées à partir de 1, le backend à partir de 0.
      const requested = Number(params.get('page') ?? '1');
      const page = Number.isFinite(requested) && requested > 1 ? Math.floor(requested) - 1 : 0;
      const query = params.get('q')?.trim() ?? '';

      this.page.set(page);
      this.query.set(query);
      this.searchInput = query;
      this.updateSeo(page, query);
      this.load(page, query);
    });
  }

  /**
   * Métadonnées de la page courante.
   *
   * <p>Le canonique doit porter la pagination : sans le `?page=`, la page 2 se déclarerait
   * identique à la première et les moteurs ne retiendraient que celle-ci. Les pages de
   * résultats de recherche, elles, ne sont pas indexables — leur contenu dépend d'un terme
   * saisi par le visiteur, et il y en aurait autant que de recherches possibles.
   */
  private updateSeo(page: number, query: string): void {
    if (query) {
      this.seo.update({ ...pageSeo.blog, noindex: true });
      return;
    }
    if (page === 0) {
      this.seo.update(pageSeo.blog);
      return;
    }
    this.seo.update({
      ...pageSeo.blog,
      title: `Blog, page ${page + 1} | RaikiServices`,
      path: `/blog?page=${page + 1}`,
    });
  }

  private load(page: number, query: string): void {
    this.loading.set(true);
    this.error.set('');

    this.blog.listPublished({ page, size: PAGE_SIZE, globalFilter: query || undefined }).subscribe({
      next: (result) => {
        this.posts.set(result.content);
        this.totalPages.set(result.totalPages);
        this.totalElements.set(result.totalElements);
        this.loading.set(false);

        // Le nombre de pages n'est connu qu'ici : c'est seulement maintenant qu'on peut voir
        // qu'une page demandée dépasse la dernière, et la retirer de l'indexation.
        if (this.pastLastPage()) {
          this.seo.update({
            ...pageSeo.blog,
            title: `Blog, page ${page + 1} | RaikiServices`,
            path: `/blog?page=${page + 1}`,
            noindex: true,
          });
        }
      },
      error: (failure: unknown) => {
        this.posts.set([]);
        this.totalPages.set(0);
        this.totalElements.set(0);
        this.error.set(apiErrorMessage(failure, 'Les articles sont momentanément indisponibles.'));
        this.loading.set(false);
      },
    });
  }

  /**
   * Vrai quand on demande une page au-delà de la dernière (`?page=99` recopié à la main).
   *
   * <p>Le message d'accueil « les premiers articles arrivent » serait faux ici : il y a bien
   * des articles, c'est la page qui n'existe pas.
   */
  protected readonly pastLastPage = computed(
    () => this.posts().length === 0 && this.page() > 0 && this.totalElements() > 0,
  );

  /** Lance une recherche : on repart de la première page, l'ancienne n'a plus de sens. */
  protected submitSearch(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchInput.trim() || null, page: null },
      // Sans ancre, `scrollPositionRestoration: 'top'` renverrait le visiteur sur la bannière
      // et il ne verrait pas que ses résultats ont changé. `anchorScrolling` est activé dans
      // `app.config.ts`, l'ancre suffit donc à cadrer sur la liste.
      fragment: ARTICLES_ANCHOR,
    });
  }

  protected clearSearch(): void {
    this.searchInput = '';
    this.submitSearch();
  }

  /** Paramètres d'un lien de pagination ; la page 1 n'a pas besoin d'être écrite. */
  protected pageLink(page: number): Record<string, string | null> {
    return { q: this.query() || null, page: page === 0 ? null : String(page + 1) };
  }
}
