import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FaqEntry } from '../models/faq.model';
import { PageSeo } from '../models/seo.model';
import { seoConfig } from '../config/seo';

/**
 * Pilote les métadonnées SEO d'une page : <title>, meta description, robots,
 * Open Graph, Twitter Cards, lien canonique et données structurées FAQPage.
 *
 * SSR-safe : Title, Meta et l'accès à document.head fonctionnent aussi au
 * prerender, donc toutes ces balises se retrouvent dans le HTML statique.
 * Appeler `update()` dans le `ngOnInit` de chaque page.
 */
/** Identifiant du <script> de données structurées FAQPage, pour le remplacer plutôt que l'empiler. */
const FAQ_SCHEMA_ID = 'faq-schema';

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

  /**
   * Déclare les questions fréquentes de la page au format FAQPage (schema.org).
   *
   * <p>Posé par le composant `faq-section`, jamais par une page directement : le balisage
   * doit décrire des questions réellement présentes dans le HTML, et les lier au composant
   * qui les affiche est la seule façon de garantir qu'ils ne divergent pas.
   *
   * <p>Un seul bloc par page — le script porte un identifiant fixe et est remplacé à chaque
   * appel. `clearFaq()` le retire quand le composant disparaît, faute de quoi il suivrait le
   * visiteur sur la page suivante lors d'une navigation côté navigateur.
   */
  setFaq(entries: FaqEntry[]): void {
    if (!entries.length) {
      this.clearFaq();
      return;
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entries.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: { '@type': 'Answer', text: entry.answer },
      })),
    };

    const head = this.document.head;
    let script = head.querySelector<HTMLScriptElement>(`script#${FAQ_SCHEMA_ID}`);

    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('id', FAQ_SCHEMA_ID);
      head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
  }

  /** Retire le balisage FAQPage de la page courante, s'il y en a un. */
  clearFaq(): void {
    this.document.head.querySelector(`script#${FAQ_SCHEMA_ID}`)?.remove();
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
