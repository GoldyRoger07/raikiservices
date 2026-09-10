/** Cycle de vie d'un article. Un brouillon reste invisible du site public. */
export type BlogStatus = 'DRAFT' | 'PUBLISHED';

export const BLOG_STATUSES: readonly BlogStatus[] = ['DRAFT', 'PUBLISHED'];

/** Libellés français affichés dans le back-office. */
export const BLOG_STATUS_LABELS: Record<BlogStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
};

/** Sévérité PrimeNG associée à chaque statut, pour les `p-tag`. */
export const BLOG_STATUS_SEVERITY: Record<BlogStatus, string> = {
  DRAFT: 'secondary',
  PUBLISHED: 'success',
};

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  /**
   * Corps de l'article. Absent des listes : le backend renvoie des résumés
   * (`summaryFrom`) pour ne pas faire transiter dix articles entiers par page.
   */
  content: string | null;
  coverImage: string | null;
  status: BlogStatus;
  /** Renseignée par le backend au passage en `PUBLISHED`, jamais saisie à la main. */
  publishedAt: string | null;
  authorId: number | null;
  authorName: string | null;
  authorPhotoUrl: string | null;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Charge utile de création et de modification.
 *
 * <p>Le slug est facultatif : laissé vide, le backend le dérive du titre et le suffixe
 * s'il est déjà pris. Le renseigner fige l'URL publique de l'article — mieux vaut ne plus
 * y toucher une fois l'article en ligne, sous peine de casser les liens partagés.
 */
export interface BlogPostRequest {
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  status?: BlogStatus;
  authorId?: number | null;
  category?: string | null;
  tags?: string[];
}
