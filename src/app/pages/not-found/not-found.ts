import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Container } from '../../components/container/container';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { MyButton } from '../../components/my-button/my-button';
import { SeparatorDesign } from '../../components/separator-design/separator-design';
import { pageSeo } from '../../config/content/seo-pages';
import { SeoService } from '../../services/seo.service';

/**
 * Page affichée pour une URL inconnue.
 *
 * <p>Elle est pré-rendue sur le chemin `/404` : `src/server.ts` sert ce fichier statique
 * avec un vrai statut HTTP 404 pour les requêtes qu'aucune route ne reconnaît, et la route
 * `**` de `app.routes.ts` y redirige les navigations côté client. Le `noindex` de sa
 * configuration SEO évite que `/404` soit lui-même indexé.
 */
@Component({
  selector: 'app-not-found',
  imports: [Header, Footer, Container, SeparatorDesign, MyButton, RouterLink],
  templateUrl: './not-found.html',
})
export default class NotFound implements OnInit {
  private readonly seo = inject(SeoService);

  /** Raccourcis vers les pages les plus demandées, pour ne pas laisser le visiteur sans issue. */
  protected readonly suggestions = [
    { label: 'Création de sites web', link: '/sites-web' },
    { label: 'Référencement (SEO)', link: '/seo' },
    { label: 'Blog', link: '/blog' },
    { label: 'Tarifs', link: '/tarifs' },
    { label: 'Études de cas', link: '/etudes-de-cas' },
    { label: 'Portfolio', link: '/portfolio' },
    { label: 'À propos', link: '/a-propos' },
  ];

  ngOnInit(): void {
    this.seo.update(pageSeo.notFound);
  }
}
