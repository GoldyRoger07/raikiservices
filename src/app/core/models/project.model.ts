/** Cycle de vie d'une réalisation. Un brouillon reste invisible du site public. */
export type ProjectStatus = 'DRAFT' | 'PUBLISHED';

export const PROJECT_STATUSES: readonly ProjectStatus[] = ['DRAFT', 'PUBLISHED'];

/** Libellés français affichés dans le back-office. */
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
};

/** Sévérité PrimeNG associée à chaque statut, pour les `p-tag`. */
export const PROJECT_STATUS_SEVERITY: Record<ProjectStatus, string> = {
  DRAFT: 'secondary',
  PUBLISHED: 'success',
};

/**
 * Réalisation présentée sur le site vitrine.
 *
 * <p>Une seule forme alimente les trois emplacements, départagés par trois drapeaux :
 * toute réalisation publiée figure au portfolio ; `caseStudy` l'ajoute à la page des études
 * de cas, où `description` et `services` sont mis en avant ; `featured` la remonte sur
 * l'accueil.
 */
export interface Project {
  id: number;
  title: string;
  slug: string;
  /** Qualification du client — « Restaurant — Pétion-Ville ». */
  clientLabel: string | null;
  /** Une phrase, pour les cartes du portfolio et de l'accueil. */
  summary: string | null;
  /**
   * Corps de l'étude de cas. `null` dans les listes du portfolio et du back-office, que le
   * backend allège ; la liste des études de cas, elle, le renvoie — c'est ce qu'elle affiche.
   */
  description: string | null;
  /** Classe PrimeIcons affichée sur l'étude de cas — « pi pi-desktop ». */
  icon: string | null;
  websiteUrl: string | null;
  /**
   * Chemin ImageKit de la couverture, pas une adresse : elle se recompose à l'affichage
   * via `imagekitUrl()`, avec ses transformations.
   */
  coverPublicId: string | null;
  /** Vide dans les listes allégées. */
  galleryPublicIds: string[];
  services: string[];
  sector: string | null;
  status: ProjectStatus;
  caseStudy: boolean;
  featured: boolean;
  /** Rang d'affichage croissant sur le site public. */
  displayOrder: number;
  /** Posée par le backend au passage en `PUBLISHED`, jamais saisie à la main. */
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Charge utile de création et de modification.
 *
 * <p>Le slug est facultatif : laissé vide, le backend le dérive du titre et le suffixe s'il
 * est déjà pris. `displayOrder` omis conserve le rang existant, et place une nouvelle
 * réalisation en fin de vitrine plutôt qu'en tête.
 */
export interface ProjectRequest {
  title: string;
  slug?: string | null;
  clientLabel?: string | null;
  summary?: string | null;
  description?: string | null;
  icon?: string | null;
  websiteUrl?: string | null;
  coverPublicId?: string | null;
  galleryPublicIds?: string[];
  services?: string[];
  sector?: string | null;
  status?: ProjectStatus;
  caseStudy?: boolean;
  featured?: boolean;
  displayOrder?: number | null;
}
