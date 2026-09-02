/**
 * Configuration SEO globale (niveau site). Source unique pour le SeoService.
 */
export const seoConfig = {
  /**
   * Domaine canonique définitif : www (raikiservices.com redirige vers www).
   * Utilisé pour construire les URLs canoniques et og:url. Sans slash final.
   */
  baseUrl: 'https://www.raikiservices.com',

  /** Nom du site (og:site_name, suffixe de titre). */
  siteName: 'RaikiServices',

  /** Locale Open Graph. */
  locale: 'fr_FR',

  /**
   * Image de partage par défaut.
   * TODO Phase 3 : remplacer par une image dédiée 1200×630 (/img/og/...).
   */
  defaultImage: '/img/logo.png',
} as const;
