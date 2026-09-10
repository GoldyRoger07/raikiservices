import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime } from 'rxjs';

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
 * Messages déposés depuis le formulaire de contact du site.
 *
 * <p>Pagination, tri et recherche sont délégués au backend (`p-table` en mode `lazy`) : la
 * table n'a jamais en mémoire que la page affichée, et le filtre porte sur l'ensemble des
 * messages, pas seulement sur la page courante.
 */
@Component({
  selector: 'app-contact-messages',
  imports: [
    RouterLink,
    DatePipe,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    HasPermission,
  ],
  templateUrl: './contact-messages.html',
})
export default class ContactMessages {
  private readonly contacts = inject(ContactService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly toast = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly items = signal<ContactMessage[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);

  protected readonly statusLabels = CONTACT_STATUS_LABELS;
  protected readonly statusSeverity = CONTACT_STATUS_SEVERITY;

  /** Options du filtre par statut ; « Tous » remet le filtre à zéro. */
  protected readonly statusOptions = [
    { label: 'Tous les statuts', value: null },
    ...CONTACT_STATUSES.map((status) => ({ label: CONTACT_STATUS_LABELS[status], value: status })),
  ];

  protected search = '';
  protected statusFilter: ContactStatus | null = null;

  /** Dernier évènement de la table : rejoué quand la recherche ou le filtre changent. */
  private lastEvent: TableLazyLoadEvent = { first: 0, rows: 10 };

  /** Frappe au clavier : on attend une pause avant d'interroger le serveur. */
  private readonly searchInput = new Subject<void>();

  constructor() {
    this.searchInput.pipe(debounceTime(350)).subscribe(() => this.reload());
  }

  protected onSearchChange(): void {
    this.searchInput.next();
  }

  protected onStatusChange(): void {
    this.reload();
  }

  /** Rejoue la requête en repartant de la première page. */
  protected reload(): void {
    this.load({ ...this.lastEvent, first: 0 });
  }

  protected load(event: TableLazyLoadEvent): void {
    this.lastEvent = event;
    this.loading.set(true);

    const rows = event.rows ?? 10;
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;

    this.contacts
      .list({
        page: Math.floor((event.first ?? 0) / rows),
        size: rows,
        sortField: sortField ?? 'submittedAt',
        sortOrder: event.sortOrder === 1 ? 'asc' : 'desc',
        globalFilter: this.search,
        status: this.statusFilter,
      })
      .subscribe({
        next: (page) => {
          this.items.set(page.content);
          this.total.set(page.totalElements);
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

  protected open(message: ContactMessage): void {
    void this.router.navigate(['/admin/contact', message.id]);
  }

  protected confirmDelete(message: ContactMessage, event: Event): void {
    event.stopPropagation();
    this.confirmation.confirm({
      header: 'Supprimer ce message',
      message: `Le message de ${message.firstName} ${message.lastName ?? ''} sera définitivement supprimé.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(message),
    });
  }

  private delete(message: ContactMessage): void {
    this.contacts.delete(message.id).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Message supprimé' });
        this.load(this.lastEvent);
      },
      error: (failure: unknown) =>
        this.toast.add({
          severity: 'error',
          summary: 'Suppression impossible',
          detail: apiErrorMessage(failure),
        }),
    });
  }
}
