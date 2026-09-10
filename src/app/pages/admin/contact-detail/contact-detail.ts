import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

import { HasPermission } from '../../../core/directives/has-permission';
import {
  CONTACT_STATUSES,
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_SEVERITY,
  ContactMessage,
  ContactStatus,
} from '../../../core/models/contact.model';
import { ContactService } from '../../../core/services/contact.service';
import { apiErrorMessage } from '../../../core/utils/http.util';

/**
 * Fiche d'un message de contact.
 *
 * <p>Le chemin `/admin/contact/:id` est celui des liens envoyés par email au dépôt d'un
 * message (`EmailService`) : le renommer casserait les notifications déjà parties.
 *
 * <p>Le message lui-même est immuable ; seuls le statut et les notes internes se modifient.
 */
@Component({
  selector: 'app-contact-detail',
  imports: [
    RouterLink,
    DatePipe,
    FormsModule,
    ButtonModule,
    SelectModule,
    TagModule,
    TextareaModule,
    SkeletonModule,
    TooltipModule,
    HasPermission,
  ],
  templateUrl: './contact-detail.html',
})
export default class ContactDetail implements OnInit {
  private readonly contacts = inject(ContactService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  protected readonly message = signal<ContactMessage | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly notFound = signal(false);

  protected readonly statusLabels = CONTACT_STATUS_LABELS;
  protected readonly statusSeverity = CONTACT_STATUS_SEVERITY;
  protected readonly statusOptions = CONTACT_STATUSES.map((status) => ({
    label: CONTACT_STATUS_LABELS[status],
    value: status,
  }));

  /** Copie de travail du suivi : le formulaire n'écrit pas dans l'objet affiché. */
  protected status: ContactStatus = 'NEW';
  protected adminNotes = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.loading.set(false);
      this.notFound.set(true);
      return;
    }

    this.contacts.getById(id).subscribe({
      next: (message) => {
        this.message.set(message);
        this.status = message.status;
        this.adminNotes = message.adminNotes ?? '';
        this.loading.set(false);
      },
      error: (failure: unknown) => {
        this.loading.set(false);
        this.notFound.set(true);
        this.toast.add({
          severity: 'error',
          summary: 'Message introuvable',
          detail: apiErrorMessage(failure),
        });
      },
    });
  }

  protected save(): void {
    const current = this.message();
    if (!current || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.contacts.update(current.id, { status: this.status, adminNotes: this.adminNotes }).subscribe({
      next: (updated) => {
        this.message.set(updated);
        this.saving.set(false);
        this.toast.add({ severity: 'success', summary: 'Suivi enregistré' });
      },
      error: (failure: unknown) => {
        this.saving.set(false);
        this.toast.add({
          severity: 'error',
          summary: 'Enregistrement impossible',
          detail: apiErrorMessage(failure),
        });
      },
    });
  }

  protected confirmDelete(): void {
    const current = this.message();
    if (!current) {
      return;
    }

    this.confirmation.confirm({
      header: 'Supprimer ce message',
      message: 'Cette suppression est définitive.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.contacts.delete(current.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Message supprimé' });
            void this.router.navigate(['/admin/contact']);
          },
          error: (failure: unknown) =>
            this.toast.add({
              severity: 'error',
              summary: 'Suppression impossible',
              detail: apiErrorMessage(failure),
            }),
        }),
    });
  }

  /** Lien de réponse pré-rempli, ouvert dans le client mail du poste. */
  protected mailtoLink(message: ContactMessage): string {
    const subject = encodeURIComponent(`Re : ${message.subject || 'Votre demande'}`);
    return `mailto:${message.email}?subject=${subject}`;
  }
}
