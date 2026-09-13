import { Component, computed, inject, signal } from '@angular/core';
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
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_SEVERITY,
  Project,
} from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { imagekitUrl } from '../../../core/utils/imagekit';
import { apiErrorMessage } from '../../../core/utils/http.util';

/**
 * Réalisations : liste, réordonnancement, accès à l'éditeur, suppression.
 *
 * <p>La liste montre aussi les brouillons — c'est tout l'intérêt de la face administration.
 * Elle est triée par rang d'affichage, l'ordre que verront les visiteurs.
 *
 * <p>Les flèches ne permutent que deux voisins de la page affichée, et le backend
 * redistribue entre eux les rangs qu'ils occupaient déjà : réordonner la page 2 ne
 * bouscule donc pas la page 1. Elles disparaissent dès qu'un autre tri est appliqué, où
 * « monter » n'aurait plus de sens visible.
 */
@Component({
  selector: 'app-projects',
  imports: [
    RouterLink,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    TooltipModule,
    HasPermission,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export default class Projects {
  private readonly projects = inject(ProjectService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  protected readonly items = signal<Project[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly reordering = signal(false);

  protected readonly statusLabels = PROJECT_STATUS_LABELS;
  protected readonly statusSeverity = PROJECT_STATUS_SEVERITY;
  protected readonly thumbnail = (project: Project) => imagekitUrl(project.coverPublicId, 400);

  /** Tri courant ; les flèches n'ont de sens que sur le rang d'affichage. */
  protected readonly sortedByOrder = signal(true);
  protected readonly canReorder = computed(() => this.sortedByOrder() && !this.reordering());

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
    const field = sortField ?? 'displayOrder';
    this.sortedByOrder.set(field === 'displayOrder');

    this.projects
      .list({
        page: Math.floor((event.first ?? 0) / rows),
        size: rows,
        sortField: field,
        sortOrder: event.sortOrder === -1 ? 'desc' : 'asc',
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

  // ──────────────── Ordre de la vitrine ────────────────

  /** Déplace une réalisation d'un cran, `direction` valant -1 (monter) ou 1 (descendre). */
  protected move(index: number, direction: -1 | 1): void {
    const target = index + direction;
    const current = this.items();
    if (!this.canReorder() || target < 0 || target >= current.length) {
      return;
    }

    const reordered = [...current];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    // Affiché tout de suite : attendre la réponse ferait sautiller la ligne sous le curseur.
    this.items.set(reordered);
    this.reordering.set(true);

    this.projects.reorder(reordered.map((project) => project.id)).subscribe({
      next: () => {
        this.reordering.set(false);
        // Rechargé pour récupérer les rangs réellement posés par le backend.
        this.load(this.lastEvent);
      },
      error: (failure: unknown) => {
        this.reordering.set(false);
        this.items.set(current);
        this.toast.add({
          severity: 'error',
          summary: 'Réordonnancement impossible',
          detail: apiErrorMessage(failure),
        });
      },
    });
  }

  protected confirmDelete(project: Project): void {
    this.confirmation.confirm({
      header: 'Supprimer cette réalisation',
      message: `« ${project.title} » sera définitivement supprimée. Ses images restent dans la bibliothèque.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.projects.delete(project.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Réalisation supprimée' });
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
