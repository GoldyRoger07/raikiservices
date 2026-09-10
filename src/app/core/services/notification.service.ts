import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/api.model';
import {
  AppNotification,
  NOTIFICATION_ROUTES,
  NotificationPreference,
  NotificationSetting,
  SseEvent,
} from '../models/notification.model';
import { AuthService } from './auth.service';

/** Types d'évènement écoutés sur le flux : le backend nomme chaque évènement SSE par son type. */
const STREAM_EVENT_NAMES = Object.keys(NOTIFICATION_ROUTES);

/**
 * Cloche de notifications du back-office.
 *
 * <p>L'historique arrive par HTTP ; les arrivées en direct par le flux SSE
 * `/api/v1/notifications/stream`. `EventSource` ne permettant pas d'ajouter d'en-tête, le
 * jeton d'accès y voyage en paramètre d'URL — le backend n'accepte cette exception que sur
 * ce chemin précis.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly baseUrl = `${environment.apiUrl}/api/v1/notifications`;

  private readonly unreadState = signal(0);
  readonly unreadCount = this.unreadState.asReadonly();

  /** Évènements reçus en direct : les écrans concernés s'y abonnent pour se rafraîchir. */
  private readonly liveEvents = new Subject<SseEvent>();
  readonly events = this.liveEvents.asObservable();

  private stream: EventSource | null = null;

  // ──────────────── Historique ────────────────

  list(page = 0, size = 20, unreadOnly = false): Observable<PageResponse<AppNotification>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('unreadOnly', unreadOnly);
    return this.http.get<PageResponse<AppNotification>>(this.baseUrl, { params });
  }

  refreshUnreadCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/unread-count`).pipe(
      map((response) => response.count),
      tap((count) => this.unreadState.set(count)),
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http
      .patch<void>(`${this.baseUrl}/${id}/read`, {})
      .pipe(tap(() => this.unreadState.update((count) => Math.max(0, count - 1))));
  }

  markAllAsRead(): Observable<void> {
    return this.http
      .patch<void>(`${this.baseUrl}/read-all`, {})
      .pipe(tap(() => this.unreadState.set(0)));
  }

  // ──────────────── Temps réel ────────────────

  /**
   * Ouvre le flux temps réel. Sans effet côté serveur ou si le flux est déjà ouvert.
   *
   * <p>`EventSource` se reconnecte tout seul : le backend ferme la connexion au bout de cinq
   * minutes, le navigateur la rouvre dans la foulée.
   */
  connect(): void {
    if (!this.isBrowser || this.stream) {
      return;
    }
    const token = this.auth.accessToken();
    if (!token) {
      return;
    }

    const url = `${this.baseUrl}/stream?access_token=${encodeURIComponent(token)}`;
    const source = new EventSource(url, { withCredentials: true });

    for (const name of STREAM_EVENT_NAMES) {
      source.addEventListener(name, (event) => this.onEvent(event as MessageEvent<string>));
    }
    source.onerror = () => {
      // Jeton expiré pendant la connexion : le flux ne se rétablira pas seul, on le rouvrira
      // au prochain rafraîchissement de jeton plutôt que de boucler sur un 401.
      if (source.readyState === EventSource.CLOSED) {
        this.disconnect();
      }
    };

    this.stream = source;
  }

  disconnect(): void {
    this.stream?.close();
    this.stream = null;
  }

  private onEvent(event: MessageEvent<string>): void {
    try {
      const payload = JSON.parse(event.data) as SseEvent;
      this.unreadState.update((count) => count + 1);
      this.liveEvents.next(payload);
    } catch {
      // Charge utile illisible : on ignore plutôt que de casser le flux.
    }
  }

  // ──────────────── Préférences et interrupteurs ────────────────

  /** Préférences de canal du compte connecté. Aucune permission requise. */
  myPreferences(): Observable<NotificationPreference[]> {
    return this.http.get<NotificationPreference[]>(`${environment.apiUrl}/api/v1/notification-preferences`);
  }

  updateMyPreference(preference: {
    eventType: string;
    inApp: boolean;
    email: boolean;
    push: boolean;
  }): Observable<NotificationPreference> {
    return this.http.put<NotificationPreference>(
      `${environment.apiUrl}/api/v1/notification-preferences`,
      preference,
    );
  }

  /** Interrupteurs globaux. Exige `READ_NOTIFICATION_SETTINGS`. */
  settings(): Observable<NotificationSetting[]> {
    return this.http.get<NotificationSetting[]>(`${environment.apiUrl}/api/v1/notification-settings`);
  }

  /** Exige `UPDATE_NOTIFICATION_SETTINGS`. */
  updateSetting(eventType: string, enabled: boolean): Observable<NotificationSetting> {
    return this.http.put<NotificationSetting>(
      `${environment.apiUrl}/api/v1/notification-settings/${eventType}`,
      { enabled },
    );
  }
}
