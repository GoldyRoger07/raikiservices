import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { PageQuery, PageResponse } from '../models/api.model';
import { Project, ProjectRequest } from '../models/project.model';
import { CrudApi } from './crud-api';
import { toPageParams } from '../utils/http.util';

/**
 * Réalisations présentées sur le site vitrine.
 *
 * <p>Deux faces, comme le blog : `/public/v1/projects` ne sert que les réalisations
 * publiées et s'appelle sans authentification ; `/api/v1/projects` voit aussi les
 * brouillons et exige les permissions `*_PROJECT`.
 *
 * <p>Champs acceptés au tri : `title`, `slug`, `clientLabel`, `sector`, `status`,
 * `displayOrder` (défaut), `publishedAt`, `createdAt`, `updatedAt`.
 */
@Injectable({ providedIn: 'root' })
export class ProjectService extends CrudApi<Project, ProjectRequest> {
  protected readonly resourceUrl = `${environment.apiUrl}/api/v1/projects`;

  private readonly publicUrl = `${environment.apiUrl}/public/v1/projects`;

  /** Portfolio : toutes les réalisations publiées, dans l'ordre réglé au back-office. */
  listPublished(query: PageQuery = {}): Observable<PageResponse<Project>> {
    return this.http.get<PageResponse<Project>>(this.publicUrl, { params: toPageParams(query) });
  }

  /**
   * Études de cas : les réalisations publiées marquées comme telles.
   *
   * <p>Seule liste à porter `description` : la page affiche le texte de chaque étude sans
   * passer par une page de détail.
   */
  listCaseStudies(query: PageQuery = {}): Observable<PageResponse<Project>> {
    return this.http.get<PageResponse<Project>>(`${this.publicUrl}/case-studies`, {
      params: toPageParams(query),
    });
  }

  /** Sélection mise en avant sur l'accueil. */
  listFeatured(size = 4): Observable<PageResponse<Project>> {
    return this.http.get<PageResponse<Project>>(`${this.publicUrl}/featured`, {
      params: toPageParams({ page: 0, size }),
    });
  }

  /**
   * Réalisation publiée désignée par son slug.
   *
   * <p>Un brouillon répond 404 ici : le backend refuse de révéler qu'une adresse est prise
   * avant la mise en ligne.
   */
  getPublishedBySlug(slug: string): Observable<Project> {
    return this.http.get<Project>(`${this.publicUrl}/${slug}`);
  }

  /**
   * Applique un nouvel ordre à la vitrine : les identifiants dans l'ordre voulu.
   *
   * <p>Un seul appel plutôt qu'un `update` par réalisation — une coupure en cours de route
   * laisserait sinon la vitrine à moitié rangée.
   *
   * @returns le nombre de réalisations effectivement repositionnées
   */
  reorder(ids: number[]): Observable<number> {
    return this.http
      .put<{ reordered: number }>(`${this.resourceUrl}/reorder`, { ids })
      .pipe(map((response) => response.reordered));
  }
}
