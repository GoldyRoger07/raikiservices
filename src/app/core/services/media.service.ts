import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { PageQuery, PageResponse } from '../models/api.model';
import {
  CloudinaryUploadResult,
  MediaAsset,
  MediaRegisterRequest,
  MediaUpdateRequest,
  UploadEvent,
  UploadSignature,
} from '../models/media.model';
import { CrudApi } from './crud-api';
import { toPageParams } from '../utils/http.util';

/** Paramètres de liste des images : ceux de toute page, plus le dossier. */
export interface MediaQuery extends PageQuery {
  folder?: string | null;
}

/** Étapes internes de l'envoi, avant que la fiche ne soit enregistrée côté backend. */
type TransferEvent =
  { kind: 'progress'; percent: number } | { kind: 'uploaded'; result: CloudinaryUploadResult };

/**
 * Bibliothèque d'images du back-office.
 *
 * <p>Le fichier ne transite pas par le backend : celui-ci signe une autorisation, le
 * navigateur téléverse en direct chez Cloudinary, puis vient déclarer le résultat. C'est
 * ce qu'enchaîne {@link upload}.
 *
 * <p>Champs acceptés au tri : `publicId`, `originalFilename`, `format`, `bytes`, `folder`,
 * `uploadedAt` (défaut).
 */
@Injectable({ providedIn: 'root' })
export class MediaService extends CrudApi<MediaAsset, MediaRegisterRequest, MediaUpdateRequest> {
  protected readonly resourceUrl = `${environment.apiUrl}/api/v1/media`;

  /** Liste paginée, restreinte à un dossier et à ses sous-dossiers le cas échéant. */
  override list(query: MediaQuery = {}): Observable<PageResponse<MediaAsset>> {
    let params = toPageParams(query);
    if (query.folder) {
      params = params.set('folder', query.folder);
    }
    return this.http.get<PageResponse<MediaAsset>>(this.resourceUrl, { params });
  }

  /** Autorisation d'envoi à usage unique, valable pour un seul fichier. */
  signature(folder = ''): Observable<UploadSignature> {
    const params = folder ? new HttpParams().set('folder', folder) : new HttpParams();
    return this.http.post<UploadSignature>(`${this.resourceUrl}/signature`, null, { params });
  }

  /**
   * Envoie un fichier et renvoie sa fiche : signature, téléversement, déclaration.
   *
   * <p>Émet la progression au fil du transfert, puis un unique événement `done` portant la
   * fiche enregistrée. Se désabonner interrompt le transfert en cours.
   *
   * <p>Le plafond est vérifié avant d'ouvrir la connexion : refuser ici épargne au visiteur
   * l'envoi complet d'un fichier que Cloudinary rejetterait à l'arrivée.
   */
  upload(file: File, folder = '', alt: string | null = null): Observable<UploadEvent> {
    return this.signature(folder).pipe(
      switchMap((signature) => {
        if (file.size > signature.maxBytes) {
          const limit = Math.round(signature.maxBytes / (1024 * 1024));
          return throwError(
            () => new Error(`« ${file.name} » dépasse la taille autorisée (${limit} Mo).`),
          );
        }
        return this.transfer(file, signature);
      }),
      concatMap((event) => {
        if (event.kind === 'progress') {
          return of<UploadEvent>(event);
        }
        return this.register(event.result, alt).pipe(
          map((asset): UploadEvent => ({ kind: 'done', asset })),
        );
      }),
    );
  }

  /** Déclare au backend une image déjà déposée chez Cloudinary. */
  register(result: CloudinaryUploadResult, alt: string | null = null): Observable<MediaAsset> {
    return this.create({
      publicId: result.public_id,
      secureUrl: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      folder: folderOf(result.public_id),
      originalFilename: result.original_filename,
      alt,
    });
  }

  // ──────────────── Interne ────────────────

  /**
   * Téléversement direct vers Cloudinary.
   *
   * <p>En `XMLHttpRequest` et non via `HttpClient` : l'application est configurée avec
   * `withFetch()`, dont l'implémentation ne rapporte que la progression de réception, pas
   * celle de l'envoi. Sans cela, une barre de progression resterait figée à zéro pendant
   * toute la montée du fichier. L'appel sort d'ailleurs du domaine de l'API, donc hors de
   * portée de l'intercepteur d'authentification : aucun jeton ne part chez Cloudinary.
   */
  private transfer(file: File, signature: UploadSignature): Observable<TransferEvent> {
    return new Observable<TransferEvent>((subscriber) => {
      if (typeof XMLHttpRequest === 'undefined') {
        subscriber.error(new Error("L'envoi d'images n'est possible que depuis un navigateur."));
        // Rien n'a été ouvert : il n'y a rien à interrompre au désabonnement.
        return () => undefined;
      }

      // Exactement les champs couverts par la signature, plus le fichier et la clé publique :
      // Cloudinary recalcule l'empreinte sur ce qu'il reçoit et refuse au moindre écart.
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', signature.apiKey);
      form.append('timestamp', String(signature.timestamp));
      form.append('folder', signature.folder);
      form.append('signature', signature.signature);

      const request = new XMLHttpRequest();
      request.open('POST', signature.uploadUrl, true);

      request.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          subscriber.next({
            kind: 'progress',
            percent: Math.round((event.loaded / event.total) * 100),
          });
        }
      };

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          subscriber.next({ kind: 'uploaded', result: JSON.parse(request.responseText) });
          subscriber.complete();
        } else {
          subscriber.error(new Error(cloudinaryError(request)));
        }
      };

      request.onerror = () =>
        subscriber.error(new Error('Cloudinary est injoignable. Vérifiez votre connexion.'));

      request.send(form);

      return () => request.abort();
    });
  }
}

/** « raiki/projets/abc123 » donne « raiki/projets ». */
function folderOf(publicId: string): string {
  const lastSlash = publicId.lastIndexOf('/');
  return lastSlash <= 0 ? '' : publicId.slice(0, lastSlash);
}

/** Cloudinary loge ses erreurs dans `{ error: { message } }`. */
function cloudinaryError(request: XMLHttpRequest): string {
  try {
    const body = JSON.parse(request.responseText) as { error?: { message?: string } };
    if (body.error?.message) {
      return body.error.message;
    }
  } catch {
    // Réponse illisible : le statut HTTP reste la seule information exploitable.
  }
  return `Cloudinary a refusé l'envoi (erreur ${request.status}).`;
}
