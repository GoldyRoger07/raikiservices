import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { HasPermission } from '../../../core/directives/has-permission';
import { Session } from '../../../core/models/session.model';
import { SessionService } from '../../../core/services/session.service';
import { apiErrorMessage } from '../../../core/utils/http.util';

/**
 * Sessions ouvertes sur l'ensemble des comptes — une par appareil connecté.
 *
 * <p>Révoquer une session invalide son refresh token : l'appareil concerné sera déconnecté
 * dès que son access token expirera, soit quelques minutes au plus.
 */
@Component({
  selector: 'app-sessions',
  imports: [DatePipe, TableModule, ButtonModule, TagModule, TooltipModule, HasPermission],
  templateUrl: './sessions.html',
})
export default class Sessions implements OnInit {
  private readonly sessions = inject(SessionService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  protected readonly items = signal<Session[]>([]);
  protected readonly loading = signal(false);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.sessions.listAll().subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: (failure: unknown) => {
        this.loading.set(false);
        this.toast.add({
          severity: 'error',
          summary: 'Chargement impossible',
          detail: apiErrorMessage(failure),
        });
      },
    });
  }

  protected confirmRevoke(session: Session): void {
    this.confirmation.confirm({
      header: 'Révoquer cette session',
      message: `L'appareil de « ${session.username} » sera déconnecté sous quelques minutes.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Révoquer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.sessions.revoke(session.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Session révoquée' });
            this.load();
          },
          error: (failure: unknown) =>
            this.toast.add({
              severity: 'error',
              summary: 'Révocation impossible',
              detail: apiErrorMessage(failure),
            }),
        }),
    });
  }

  protected confirmRevokeAll(session: Session): void {
    this.confirmation.confirm({
      header: 'Déconnecter ce compte',
      message: `Toutes les sessions de « ${session.username} » seront fermées.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tout fermer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.sessions.revokeAllForUser(session.userId).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Sessions fermées' });
            this.load();
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

  /**
   * Libellé d'appareil lisible, déduit du `User-Agent`.
   *
   * <p>Approximatif par nature : c'est une aide à la reconnaissance visuelle, pas une
   * identification fiable — l'en-tête est déclaratif.
   */
  protected deviceLabel(device: string | null): string {
    if (!device) {
      return 'Appareil inconnu';
    }
    const browser = /Edg\//.test(device)
      ? 'Edge'
      : /Chrome\//.test(device)
        ? 'Chrome'
        : /Firefox\//.test(device)
          ? 'Firefox'
          : /Safari\//.test(device)
            ? 'Safari'
            : 'Navigateur';
    const platform = /Windows/.test(device)
      ? 'Windows'
      : /Android/.test(device)
        ? 'Android'
        : /iPhone|iPad/.test(device)
          ? 'iOS'
          : /Mac OS X/.test(device)
            ? 'macOS'
            : /Linux/.test(device)
              ? 'Linux'
              : '';
    return platform ? `${browser} — ${platform}` : browser;
  }
}
