/** Métadonnées SEO d'une page, consommées par le SeoService. */
export interface PageSeo {
  /** Balise <title> complète (idéalement ≤ 60 caractères). */
  title: string;

  /** Meta description (idéalement ≤ 155 caractères). */
  description: string;

  /**
   * Chemin de la page relatif à la racine, ex. '/seo' ou '' pour l'accueil.
   * Sert à construire l'URL canonique et og:url.
   */
  path: string;

  /**
   * Image de partage (chemin absolu depuis la racine, ex. '/img/og/og.png',
   * ou URL complète). Repli sur seoConfig.defaultImage si absent.
   */
  image?: string;

  /** Type Open Graph. 'website' par défaut. */
  type?: 'website' | 'article';

  /** Empêche l'indexation (ex. page sandbox). */
  noindex?: boolean;
}
