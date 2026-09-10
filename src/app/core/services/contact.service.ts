import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { MessageResponse, PageQuery, PageResponse } from '../models/api.model';
import {
  ContactMessage,
  ContactMessageRequest,
  ContactMessageUpdateRequest,
  ContactStatus,
} from '../models/contact.model';
import { CrudApi } from './crud-api';
import { toPageParams } from '../utils/http.util';

/** Paramètres de liste des messages : ceux de toute page, plus le filtre par statut. */
export interface ContactQuery extends PageQuery {
  status?: ContactStatus | null;
}

/**
 * Messages du formulaire de contact.
 *
 * <p>Deux faces : le dépôt public, ouvert sans authentification, et le suivi en back-office,
 * soumis aux permissions `*_CONTACT`. Il n'y a pas de création côté administration — un
 * message naît toujours du formulaire public — d'où le type `never` sur la création héritée.
 *
 * <p>Champs acceptés au tri : `firstName`, `lastName`, `email`, `companyName`,
 * `serviceCategory`, `subject`, `status`, `submittedAt` (défaut).
 */
@Injectable({ providedIn: 'root' })
export class ContactService extends CrudApi<ContactMessage, never, ContactMessageUpdateRequest> {
  protected readonly resourceUrl = `${environment.apiUrl}/api/v1/contact`;

  /**
   * Liste paginée, avec en plus le filtre par statut propre à cette ressource.
   *
   * <p>Le statut est un paramètre distinct de la recherche texte : le comparer en `LIKE` avec
   * le reste ferait remonter tout message contenant « gagné » dans son corps.
   */
  override list(query: ContactQuery = {}): Observable<PageResponse<ContactMessage>> {
    let params = toPageParams(query);
    if (query.status) {
      params = params.set('status', query.status);
    }
    return this.http.get<PageResponse<ContactMessage>>(this.resourceUrl, { params });
  }

  /** Dépôt depuis le site vitrine. Répond 202 : les emails partent en arrière-plan. */
  submit(request: ContactMessageRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.apiUrl}/public/v1/contact`, request);
  }

  /** Nombre de messages encore au statut `NEW`, pour la pastille du menu. */
  countNew(): Observable<number> {
    return this.http
      .get<{ count: number }>(`${this.resourceUrl}/unread-count`)
      .pipe(map((response) => response.count));
  }
}
