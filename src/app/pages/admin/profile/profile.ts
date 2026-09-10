import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';

import { NotificationPreference } from '../../../core/models/notification.model';
import { Session } from '../../../core/models/session.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SessionService } from '../../../core/services/session.service';
import { apiErrorMessage } from '../../../core/utils/http.util';

/**
 * Compte de l'utilisateur connecté : ses droits, ses appareils, ses préférences d'alerte.
 *
 * <p>Les informations du compte ne se modifient pas ici : le backend n'expose la modification
 * que via `/api/v1/users/{id}`, sous permission `UPDATE_USER`. Un compte sans ce droit passe
 * donc par un administrateur — c'est l'écran « Utilisateurs » qui sert à cela.
 */
@Component({
  selector: 'app-profile',
  imports: [
    DatePipe,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToggleSwitchModule,
    TooltipModule,
  ],
  templateUrl: './profile.html',
})
export default class Profile implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly sessions = inject(SessionService);
  private readonly notifications = inject(NotificationService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly displayName = this.auth.displayName;
  protected readonly initials = this.auth.initials;

  protected readonly mySessions = signal<Session[]>([]);
  protected readonly loadingSessions = signal(false);

  protected readonly preferences = signal<NotificationPreference[]>([]);
  protected readonly loadingPreferences = signal(false);

  ngOnInit(): void {
    this.loadSessions();
    this.loadPreferences();
  }

  // ──────────────── Appareils ────────────────

  protected loadSessions(): void {
    this.loadingSessions.set(true);
    this.sessions.listMine().subscribe({
      next: (list) => {
        this.mySessions.set(list);
        this.loadingSessions.set(false);
      },
      error: () => this.loadingSessions.set(false),
    });
  }

  protected confirmRevokeAll(): void {
    this.confirmation.confirm({
      header: 'Se déconnecter partout',
      message:
        'Toutes vos sessions seront fermées, y compris celle-ci. Vous devrez vous reconnecter.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tout fermer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.sessions.revokeMine().subscribe({
          next: () => {
            this.auth.clearSession();
            void this.router.navigate(['/login']);
          },
          error: (failure: unknown) =>
            this.toast.add({
              severity: 'error',
              summary: 'Fermeture impossible',
              detail: apiErrorMessage(failure),
            }),
        }),
    });
  }

  // ──────────────── Préférences de notification ────────────────

  protected loadPreferences(): void {
    this.loadingPreferences.set(true);
    this.notifications.myPreferences().subscribe({
      next: (list) => {
        this.preferences.set(list);
        this.loadingPreferences.set(false);
      },
      error: () => this.loadingPreferences.set(false),
    });
  }

  /**
   * Enregistre la ligne modifiée.
   *
   * <p>Le backend attend les trois canaux à chaque envoi : ceux qui sont omis valent `false`,
   * on renvoie donc toujours la ligne complète.
   */
  protected savePreference(preference: NotificationPreference): void {
    this.notifications
      .updateMyPreference({
        eventType: preference.eventType,
        inApp: preference.inApp,
        email: preference.email,
        push: preference.push,
      })
      .subscribe({
        next: (updated) =>
          this.preferences.update((list) =>
            list.map((item) => (item.eventType === updated.eventType ? updated : item)),
          ),
        error: (failure: unknown) => {
          this.toast.add({
            severity: 'error',
            summary: 'Préférence non enregistrée',
            detail: apiErrorMessage(failure),
          });
          // On recharge pour que l'interrupteur affiché reflète l'état réel côté serveur.
          this.loadPreferences();
        },
      });
  }

  protected deviceLabel(device: string | null): string {
    if (!device) {
      return 'Appareil inconnu';
    }
    if (/Edg\//.test(device)) return 'Edge';
    if (/Chrome\//.test(device)) return 'Chrome';
    if (/Firefox\//.test(device)) return 'Firefox';
    if (/Safari\//.test(device)) return 'Safari';
    return 'Navigateur';
  }
}
