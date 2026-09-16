/** Cycle de vie d'un témoignage. Un brouillon reste invisible du site public. */
export type TestimonialStatus = 'DRAFT' | 'PUBLISHED';

export const TESTIMONIAL_STATUSES: readonly TestimonialStatus[] = ['DRAFT', 'PUBLISHED'];

/** Libellés français affichés dans le back-office. */
export const TESTIMONIAL_STATUS_LABELS: Record<TestimonialStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
};

/** Sévérité PrimeNG associée à chaque statut, pour les `p-tag`. */
export const TESTIMONIAL_STATUS_SEVERITY: Record<TestimonialStatus, string> = {
  DRAFT: 'secondary',
  PUBLISHED: 'success',
};

/**
 * Témoignage d'un client, saisi depuis le back-office.
 *
 * <p>La réalisation liée arrive aplatie (`projectId`, `projectTitle`, `projectSlug`). Côté
 * public, ces trois champs sont `null` quand la réalisation est encore en brouillon : le
 * lien mènerait à une page introuvable.
 */
export interface Testimonial {
  id: number;
  authorName: string;
  /** Fonction de l'auteur — « Gérante ». */
  authorRole: string | null;
  company: string | null;
  /** Chemin ImageKit de la photo ou du logo, à passer par `imagekitUrl()`. */
  photoPublicId: string | null;
  /** Note de 1 à 5 ; `null` quand le témoignage s'affiche sans étoiles. */
  rating: number | null;
  content: string;
  projectId: number | null;
  projectTitle: string | null;
  projectSlug: string | null;
  /** Le client a accepté la publication. Le backend refuse de publier sans. */
  consentObtained: boolean;
  status: TestimonialStatus;
  /** Mis en avant sur l'accueil. */
  featured: boolean;
  displayOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Charge utile de création et de modification. */
export interface TestimonialRequest {
  authorName: string;
  authorRole?: string | null;
  company?: string | null;
  photoPublicId?: string | null;
  rating?: number | null;
  content: string;
  projectId?: number | null;
  consentObtained?: boolean;
  status?: TestimonialStatus;
  featured?: boolean;
  displayOrder?: number | null;
}

/** Chiffres d'ensemble des témoignages publiés. */
export interface TestimonialSummary {
  count: number;
  /** Nombre de témoignages qui portent une note. */
  ratedCount: number;
  /** Moyenne arrondie au dixième ; `null` tant qu'aucun témoignage n'est noté. */
  averageRating: number | null;
}
