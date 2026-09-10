/**
 * Bloc de contenu d'une page légale.
 *
 * Le format en blocs — plutôt qu'un simple tableau de paragraphes — permet d'alterner
 * librement texte et listes à l'intérieur d'une même section, ce qu'un document juridique
 * fait constamment.
 */
export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] };

/** Section numérotée d'une page légale. */
export interface LegalSection {
  title: string;
  blocks: LegalBlock[];
}

/** Document légal complet : en-tête, date de mise à jour et sections. */
export interface LegalDocument {
  /** Titre affiché dans la bannière de la page. */
  heroTitle: string;

  /** Accroche de la bannière. */
  heroDesc: string;

  /** Date de dernière mise à jour, déjà formatée pour l'affichage. */
  updatedAt: string;

  sections: LegalSection[];
}
