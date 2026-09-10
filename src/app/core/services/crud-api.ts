import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PageQuery, PageResponse } from '../models/api.model';
import { toPageParams } from '../utils/http.util';

/**
 * Socle des ressources REST du back-office.
 *
 * <p>Toutes exposent le même contrat côté backend — liste paginée, détail, création,
 * modification, suppression — et la même enveloppe `PageResponse`. Les services concrets
 * n'ont donc qu'à déclarer leur URL, et n'ajoutent que leurs endpoints spécifiques.
 */
export abstract class CrudApi<T, TCreate, TUpdate = TCreate> {
  protected readonly http = inject(HttpClient);

  /** URL complète de la ressource, sans slash final (ex. `.../api/v1/users`). */
  protected abstract readonly resourceUrl: string;

  list(query: PageQuery = {}): Observable<PageResponse<T>> {
    return this.http.get<PageResponse<T>>(this.resourceUrl, { params: toPageParams(query) });
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.resourceUrl}/${id}`);
  }

  create(body: TCreate): Observable<T> {
    return this.http.post<T>(this.resourceUrl, body);
  }

  update(id: number, body: TUpdate): Observable<T> {
    return this.http.put<T>(`${this.resourceUrl}/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }

  /**
   * Récupère la ressource entière en une page.
   *
   * <p>Pratique pour alimenter un sélecteur (rôles d'un utilisateur, permissions d'un rôle).
   * Le backend plafonne `size` à 100, ce qui suffit largement pour ces référentiels.
   */
  listAll(sortField?: string): Observable<PageResponse<T>> {
    return this.list({ page: 0, size: 100, sortField, sortOrder: 'asc' });
  }
}
