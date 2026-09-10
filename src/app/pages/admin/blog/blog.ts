import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime } from 'rxjs';

import { HasPermission } from '../../../core/directives/has-permission';
import {
  BLOG_STATUS_LABELS,
  BLOG_STATUS_SEVERITY,
  BlogPost,
} from '../../../core/models/blog.model';
import { BlogService } from '../../../core/services/blog.service';
import { apiErrorMessage } from '../../../core/utils/http.util';

/**
 * Articles du blog : liste, accès à l'éditeur, suppression.
 *
 * <p>La liste montre aussi les brouillons — c'est tout l'intérêt de la face administration.
 * Le corps des articles n'y est pas chargé : le backend renvoie des résumés, et l'éditeur
 * recharge l'article complet à l'ouverture.
 *
 * <p>Le chemin `/admin/blog` est celui vers lequel pointent les notifications
 * `BLOG_PUBLISHED` : le renommer casserait les liens déjà envoyés.
 */
@Component({
  selector: 'app-blog',
  imports: [
    RouterLink,
    DatePipe,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    HasPermission,
  ],
  templateUrl: './blog.html',
})
export default class Blog {
  private readonly blog = inject(BlogService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  protected readonly items = signal<BlogPost[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);

  protected readonly statusLabels = BLOG_STATUS_LABELS;
  protected readonly statusSeverity = BLOG_STATUS_SEVERITY;

  protected search = '';

  private lastEvent: TableLazyLoadEvent = { first: 0, rows: 10 };
  private readonly searchInput = new Subject<void>();

  constructor() {
    this.searchInput.pipe(debounceTime(350)).subscribe(() => this.reload());
  }

  protected onSearchChange(): void {
    this.searchInput.next();
  }

  protected reload(): void {
    this.load({ ...this.lastEvent, first: 0 });
  }

  protected load(event: TableLazyLoadEvent): void {
    this.lastEvent = event;
    this.loading.set(true);

    const rows = event.rows ?? 10;
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;

    this.blog
      .list({
        page: Math.floor((event.first ?? 0) / rows),
        size: rows,
        sortField: sortField ?? 'createdAt',
        sortOrder: event.sortOrder === 1 ? 'asc' : 'desc',
        globalFilter: this.search,
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

  protected confirmDelete(post: BlogPost): void {
    this.confirmation.confirm({
      header: 'Supprimer cet article',
      message: `L'article « ${post.title} » sera définitivement supprimé.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.blog.delete(post.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Article supprimé' });
            this.load(this.lastEvent);
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
}
