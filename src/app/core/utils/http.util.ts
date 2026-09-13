import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ApiError, PageQuery } from '../models/api.model';

/**
 * Construit les paramètres de liste attendus par le backend.
 *
 * Les valeurs vides sont omises : le backend applique alors ses propres défauts
 * (`page=0`, `size=10`, tri par défaut de chaque ressource).
 */
export function toPageParams(query: PageQuery): HttpParams {
  let params = new HttpParams();
  if (query.page != null) {
    params = params.set('page', query.page);
  }
  if (query.size != null) {
    params = params.set('size', query.size);
  }
  if (query.sortField) {
    params = params.set('sortField', query.sortField);
  }
  if (query.sortOrder) {
    params = params.set('sortOrder', query.sortOrder);
  }
  if (query.globalFilter?.trim()) {
    params = params.set('globalFilter', query.globalFilter.trim());
  }
  return params;
}

/**
 * Message lisible tiré d'une erreur HTTP.
 *
 * Le backend renvoie un corps `ApiError` uniforme ; on retombe sur un message générique
 * quand la requête n'a même pas atteint le serveur (backend éteint, CORS, réseau coupé).
 *
 * Les `Error` ordinaires sont acceptées elles aussi : l'envoi d'images vers ImageKit se
 * fait hors de `HttpClient` et rapporte ses refus ainsi. Sans cela, ses messages — pourtant
 * les plus utiles, ceux de la signature ou du plafond de taille — seraient remplacés par le
 * texte générique.
 */
export function apiErrorMessage(error: unknown, fallback = 'Une erreur est survenue.'): string {
  if (!(error instanceof HttpErrorResponse)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }
  if (error.status === 0) {
    return "Le serveur est injoignable. Vérifiez que l'API est démarrée.";
  }
  const body = error.error as ApiError | string | null;
  if (typeof body === 'string' && body.trim()) {
    return body;
  }
  if (body && typeof body === 'object' && body.message) {
    return body.message;
  }
  return fallback;
}

/** Erreurs de validation par champ, vides si la réponse n'en porte pas. */
export function apiFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof HttpErrorResponse)) {
    return {};
  }
  const body = error.error as ApiError | null;
  return body?.fieldErrors ?? {};
}
