import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Session } from '../models/session.model';

/**
 * Sessions ouvertes — une par appareil connecté.
 *
 * <p>Deux niveaux : ses propres sessions, accessibles à tout compte connecté, et l'ensemble
 * des sessions, réservé aux porteurs de `READ_SESSION` / `DELETE_SESSION`.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/sessions`;

  /** Toutes les sessions, tous comptes confondus. Exige `READ_SESSION`. */
  listAll(): Observable<Session[]> {
    return this.http.get<Session[]>(this.baseUrl);
  }

  /** Ses propres sessions. Aucune permission requise. */
  listMine(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/me`);
  }

  /** Ferme une session précise. Exige `DELETE_SESSION`. */
  revoke(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** Ferme toutes les sessions d'un compte. Exige `DELETE_SESSION`. */
  revokeAllForUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${userId}`);
  }

  /**
   * Ferme toutes ses propres sessions, celle en cours comprise.
   *
   * <p>C'est le geste à faire après la perte d'un appareil : le cookie de refresh est effacé
   * dans la foulée, il faut donc se reconnecter.
   */
  revokeMine(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me`, { withCredentials: true });
  }
}
