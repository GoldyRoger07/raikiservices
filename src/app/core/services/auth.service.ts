import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { MessageResponse } from '../models/api.model';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserSummary,
  VerifyOtpRequest,
} from '../models/auth.model';

/**
 * Session du back-office.
 *
 * <p>L'access token est gardé <b>en mémoire seulement</b> : le stocker dans `localStorage`
 * l'exposerait au moindre XSS. La persistance entre deux chargements de page est assurée par
 * le cookie HttpOnly `refresh_token` déposé par le backend — d'où l'appel à
 * {@link restoreSession} au démarrage de l'application.
 *
 * <p>Toutes les requêtes vers `/api/v1/auth` partent avec `withCredentials`, sans quoi le
 * navigateur n'enverrait pas ce cookie.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly baseUrl = `${environment.apiUrl}/api/v1/auth`;

  private readonly accessTokenState = signal<string | null>(null);
  private readonly userState = signal<UserSummary | null>(null);
  /** Passe à vrai une fois la tentative de restauration terminée, qu'elle ait abouti ou non. */
  private readonly readyState = signal(false);

  readonly user = this.userState.asReadonly();
  readonly ready = this.readyState.asReadonly();
  readonly isAuthenticated = computed(() => this.userState() !== null);

  /** Permissions effectives du compte connecté, en `Set` pour un test en temps constant. */
  private readonly permissionSet = computed(() => new Set(this.userState()?.permissions ?? []));

  /** Nom affiché : prénom + nom quand ils existent, sinon le nom d'utilisateur. */
  readonly displayName = computed(() => {
    const current = this.userState();
    if (!current) {
      return '';
    }
    const full = `${current.firstName ?? ''} ${current.lastName ?? ''}`.trim();
    return full || current.username;
  });

  /** Initiales, pour l'avatar de la barre supérieure. */
  readonly initials = computed(() => {
    const name = this.displayName();
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0];
    return letters.toUpperCase();
  });

  /** Minuteur de rafraîchissement proactif ; annulé à la déconnexion. */
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  accessToken(): string | null {
    return this.accessTokenState();
  }

  // ──────────────── Droits ────────────────

  /** Vrai si le compte porte cette permission (ex. `READ_USER`). */
  has(permission: string): boolean {
    return this.permissionSet().has(permission);
  }

  /** Vrai si le compte porte au moins une des permissions listées. */
  hasAny(permissions: readonly string[]): boolean {
    if (permissions.length === 0) {
      return this.isAuthenticated();
    }
    const owned = this.permissionSet();
    return permissions.some((permission) => owned.has(permission));
  }

  hasRole(role: string): boolean {
    return this.userState()?.roles.includes(role) ?? false;
  }

  // ──────────────── Cycle de vie de la session ────────────────

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, request, { withCredentials: true })
      .pipe(tap((response) => this.applyTokens(response)));
  }

  /**
   * Tente de reprendre la session à partir du cookie de refresh.
   *
   * <p>Ne rejette jamais : un visiteur non connecté est un cas normal, pas une erreur. Le
   * résultat indique simplement si une session a pu être reprise.
   */
  restoreSession(): Observable<boolean> {
    // Côté serveur, le cookie du navigateur n'est pas disponible : les écrans d'administration
    // sont rendus côté client (cf. app.routes.server.ts), la restauration s'y fera.
    if (!this.isBrowser || this.readyState()) {
      this.readyState.set(true);
      return of(this.isAuthenticated());
    }
    return this.refresh().pipe(
      map(() => true),
      catchError(() => of(false)),
      tap(() => this.readyState.set(true)),
    );
  }

  refresh(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/refresh`, {}, { withCredentials: true })
      .pipe(tap((response) => this.applyTokens(response)));
  }

  /** Recharge le profil : utile après modification de ses propres rôles ou informations. */
  loadProfile(): Observable<UserSummary> {
    return this.http
      .get<UserSummary>(`${this.baseUrl}/me`)
      .pipe(tap((profile) => this.userState.set(profile)));
  }

  /**
   * Ferme la session côté serveur puis efface l'état local.
   *
   * <p>L'état local est vidé quoi qu'il arrive : si le serveur est injoignable, l'utilisateur
   * doit tout de même se retrouver déconnecté de l'interface.
   */
  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        catchError(() => of(void 0)),
        tap(() => this.clearSession()),
      );
  }

  /** Efface la session locale sans appeler le serveur (refresh expiré, compte désactivé…). */
  clearSession(): void {
    this.accessTokenState.set(null);
    this.userState.set(null);
    this.readyState.set(true);
    this.cancelScheduledRefresh();
  }

  // ──────────────── Parcours public ────────────────

  register(request: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}/register`, request);
  }

  verifyOtp(request: VerifyOtpRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}/verify-otp`, request);
  }

  resendVerification(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}/resend-verification`, { email });
  }

  forgotPassword(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}/reset-password`, request, {
      withCredentials: true,
    });
  }

  // ──────────────── Interne ────────────────

  private applyTokens(response: AuthResponse): void {
    this.accessTokenState.set(response.accessToken);
    this.userState.set(response.user);
    this.readyState.set(true);
    this.scheduleRefresh(response.expiresIn);
  }

  /**
   * Programme un rafraîchissement avant l'expiration de l'access token.
   *
   * <p>Déclenché à 80 % de la durée de vie, avec un plancher de 15 secondes : sans cela, une
   * session inactive plus longtemps que l'access token verrait sa prochaine requête partir
   * avec un jeton périmé, et l'intercepteur devrait la rejouer.
   */
  private scheduleRefresh(expiresInSeconds: number): void {
    this.cancelScheduledRefresh();
    if (!this.isBrowser || !expiresInSeconds) {
      return;
    }
    const delayMs = Math.max(expiresInSeconds * 0.8, 15) * 1000;
    this.refreshTimer = setTimeout(() => {
      this.refresh().subscribe({ error: () => this.clearSession() });
    }, delayMs);
  }

  private cancelScheduledRefresh(): void {
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
