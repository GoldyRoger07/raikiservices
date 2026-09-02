import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PageSeo } from '../models/seo.model';
import { seoConfig } from '../config/seo';

/**
 * Pilote les métadonnées SEO d'une page : <title>, meta description, robots,
 * Open Graph, Twitter Cards et lien canonique.
 *
 * SSR-safe : Title, Meta et l'accès à document.head fonctionnent aussi au
 * prerender, donc toutes ces balises se retrouvent dans le HTML statique.
 * Appeler `update()` dans le `ngOnInit` de chaque page.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(page: PageSeo): void {
    const url = this.absoluteUrl(page.path);
    const image = this.absoluteUrl(page.image ?? seoConfig.defaultImage);
    const type = page.type ?? 'website';

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({
      name: 'robots',
      content: page.noindex ? 'noindex, nofollow' : 'index, follow',
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:site_name', content: seoConfig.siteName });
    this.meta.updateTag({ property: 'og:locale', content: seoConfig.locale });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(page.noindex ? null : url);
  }

  /** Transforme un chemin racine en URL absolue ; laisse passer une URL déjà complète. */
  private absoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//.test(pathOrUrl)) {
      return pathOrUrl;
    }
    const base = seoConfig.baseUrl.replace(/\/$/, '');
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return path === '/' ? base : `${base}${path}`;
  }

  /** Crée/met à jour <link rel="canonical">, ou le retire si url est null. */
  private setCanonical(url: string | null): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!url) {
      link?.remove();
      return;
    }

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
