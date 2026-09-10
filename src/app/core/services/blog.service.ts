import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PageQuery, PageResponse } from '../models/api.model';
import { BlogPost, BlogPostRequest } from '../models/blog.model';
import { CrudApi } from './crud-api';
import { toPageParams } from '../utils/http.util';

/**
 * Articles de blog.
 *
 * <p>Deux faces, comme le contact : `/public/v1/blog` ne sert que les articles publiés et
 * s'appelle sans authentification ; `/api/v1/blog` voit aussi les brouillons et exige les
 * permissions `*_BLOG`.
 *
 * <p>Champs acceptés au tri : `title`, `slug`, `category`, `status`, `publishedAt`,
 * `createdAt` (défaut côté administration), `updatedAt`.
 */
@Injectable({ providedIn: 'root' })
export class BlogService extends CrudApi<BlogPost, BlogPostRequest> {
  protected readonly resourceUrl = `${environment.apiUrl}/api/v1/blog`;

  private readonly publicUrl = `${environment.apiUrl}/public/v1/blog`;

  /** Articles publiés, pour le site vitrine. Trié par date de publication décroissante. */
  listPublished(query: PageQuery = {}): Observable<PageResponse<BlogPost>> {
    return this.http.get<PageResponse<BlogPost>>(this.publicUrl, { params: toPageParams(query) });
  }

  /**
   * Article publié désigné par son slug.
   *
   * <p>Un brouillon répond 404 ici : le backend refuse de révéler qu'une adresse est prise
   * avant la mise en ligne.
   */
  getPublishedBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.publicUrl}/${slug}`);
  }
}
