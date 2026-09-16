import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { PageQuery, PageResponse } from '../models/api.model';
import {
  Testimonial,
  TestimonialRequest,
  TestimonialSummary,
} from '../models/testimonial.model';
import { CrudApi } from './crud-api';
import { toPageParams } from '../utils/http.util';

/**
 * Témoignages clients.
 *
 * <p>Deux faces, comme les réalisations : `/public/v1/testimonials` ne sert que les
 * témoignages publiés et s'appelle sans authentification ; `/api/v1/testimonials` voit
 * aussi les brouillons et exige les permissions `*_TESTIMONIAL`.
 *
 * <p>Champs acceptés au tri : `authorName`, `company`, `rating`, `status`,
 * `displayOrder` (défaut), `publishedAt`, `createdAt`, `updatedAt`.
 */
@Injectable({ providedIn: 'root' })
export class TestimonialService extends CrudApi<Testimonial, TestimonialRequest> {
  protected readonly resourceUrl = `${environment.apiUrl}/api/v1/testimonials`;

  private readonly publicUrl = `${environment.apiUrl}/public/v1/testimonials`;

  /** Tous les témoignages publiés, dans l'ordre réglé au back-office. */
  listPublished(query: PageQuery = {}): Observable<PageResponse<Testimonial>> {
    return this.http.get<PageResponse<Testimonial>>(this.publicUrl, {
      params: toPageParams(query),
    });
  }

  /** Sélection mise en avant sur l'accueil. */
  listFeatured(size = 3): Observable<PageResponse<Testimonial>> {
    return this.http.get<PageResponse<Testimonial>>(`${this.publicUrl}/featured`, {
      params: toPageParams({ page: 0, size }),
    });
  }

  /** Témoignages rattachés à une réalisation publiée ; liste vide si elle n'en a aucun. */
  listByProject(slug: string): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.publicUrl}/project/${encodeURIComponent(slug)}`);
  }

  /** Nombre d'avis publiés et note moyenne. */
  summary(): Observable<TestimonialSummary> {
    return this.http.get<TestimonialSummary>(`${this.publicUrl}/summary`);
  }

  /**
   * Applique un nouvel ordre : les identifiants dans l'ordre voulu.
   *
   * @returns le nombre de témoignages effectivement repositionnés
   */
  reorder(ids: number[]): Observable<number> {
    return this.http
      .put<{ reordered: number }>(`${this.resourceUrl}/reorder`, { ids })
      .pipe(map((response) => response.reordered));
  }
}
