/**
 * Enveloppe de pagination commune à toutes les listes de l'API
 * (`PageResponse<T>` côté backend).
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/** Paramètres de liste envoyés en query string. Tous sont optionnels. */
export interface PageQuery {
  page?: number;
  size?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  globalFilter?: string;
}

/** Corps d'erreur uniforme renvoyé par le `GlobalExceptionHandler` du backend. */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  /** Erreurs de validation par champ, présent uniquement sur les 400. */
  fieldErrors?: Record<string, string>;
}

/** Réponse des endpoints qui ne renvoient qu'un message neutre. */
export interface MessageResponse {
  message: string;
}
