import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime } from 'rxjs';

import { HasPermission } from '../../../core/directives/has-permission';
import { Permission } from '../../../core/models/permission.model';
import { PermissionService } from '../../../core/services/permission.service';
import { apiErrorMessage, apiFieldErrors } from '../../../core/utils/http.util';

/**
 * Référentiel des permissions.
 *
 * <p>Les permissions système sont celles que les contrôleurs du backend citent nommément dans
 * leurs `@PreAuthorize` : les renommer ou les supprimer rendrait les endpoints correspondants
 * inaccessibles à tout le monde. Le backend les protège, l'interface ne les propose pas.
 *
 * <p>Une permission créée ici n'a d'effet que si un endpoint la vérifie côté backend : cet
 * écran sert surtout à consulter le référentiel et à préparer un droit à venir.
 */
@Component({
  selector: 'app-permissions',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    HasPermission,
  ],
  templateUrl: './permissions.html',
})
export default class Permissions {
  private readonly permissions = inject(PermissionService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  protected readonly items = signal<Permission[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  protected readonly dialogOpen = signal(false);
  protected readonly editing = signal<Permission | null>(null);
  protected readonly formError = signal('');

  protected search = '';

  private lastEvent: TableLazyLoadEvent = { first: 0, rows: 25 };
  private readonly searchInput = new Subject<void>();

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Z0-9_]*$/)]],
    module: [''],
    action: [''],
    description: [''],
  });

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

    const rows = event.rows ?? 25;
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;

    this.permissions
      .list({
        page: Math.floor((event.first ?? 0) / rows),
        size: rows,
        sortField: sortField ?? 'name',
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

  protected openCreate(): void {
    this.editing.set(null);
    this.formError.set('');
    this.form.reset({ name: '', module: '', action: '', description: '' });
    this.dialogOpen.set(true);
  }

  protected openEdit(permission: Permission): void {
    this.editing.set(permission);
    this.formError.set('');
    this.form.reset({
      name: permission.name,
      module: permission.module ?? '',
      action: permission.action ?? '',
      description: permission.description ?? '',
    });
    this.dialogOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      name: value.name.trim().toUpperCase(),
      module: value.module.trim().toUpperCase() || null,
      action: value.action.trim().toUpperCase() || null,
      description: value.description.trim() || null,
    };

    this.saving.set(true);
    this.formError.set('');

    const current = this.editing();
    const request = current
      ? this.permissions.update(current.id, payload)
      : this.permissions.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogOpen.set(false);
        this.toast.add({
          severity: 'success',
          summary: current ? 'Permission mise à jour' : 'Permission créée',
        });
        this.load(this.lastEvent);
      },
      error: (failure: unknown) => {
        this.saving.set(false);
        const fields = apiFieldErrors(failure);
        this.formError.set(Object.values(fields)[0] ?? apiErrorMessage(failure));
      },
    });
  }

  protected confirmDelete(permission: Permission): void {
    this.confirmation.confirm({
      header: 'Supprimer cette permission',
      message: `« ${permission.name} » sera supprimée. Le backend refusera si un rôle la porte encore.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.permissions.delete(permission.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Permission supprimée' });
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
