import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LaunchOfferRequest, LaunchOfferState } from '../models/launch-offer.model';

/**
 * Offre de lancement de la page des tarifs.
 *
 * <p>Trop simple pour `CrudApi` : il n'y a qu'une ressource, ni liste ni identifiant. La
 * face publique est appelée sans authentification à chaque affichage de la page.
 */
@Injectable({ providedIn: 'root' })
export class LaunchOfferService {
  private readonly http = inject(HttpClient);

  private readonly publicUrl = `${environment.apiUrl}/public/v1/launch-offer`;
  private readonly adminUrl = `${environment.apiUrl}/api/v1/launch-offer`;

  /** État de l'offre pour le site vitrine. */
  getPublic(): Observable<LaunchOfferState> {
    return this.http.get<LaunchOfferState>(this.publicUrl);
  }

  get(): Observable<LaunchOfferState> {
    return this.http.get<LaunchOfferState>(this.adminUrl);
  }

  update(request: LaunchOfferRequest): Observable<LaunchOfferState> {
    return this.http.put<LaunchOfferState>(this.adminUrl, request);
  }
}
