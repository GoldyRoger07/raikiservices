import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime } from 'rxjs';

import { HasPermission } from '../../../core/directives/has-permission';
import { Permission } from '../../../core/models/permission.model';
import { Role } from '../../../core/models/role.model';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { RoleService } from '../../../core/services/role.service';
import { apiErrorMessage, apiFieldErrors } from '../../../core/utils/http.util';

/** Permissions regroupées par module, pour le sélecteur du formulaire. */
interface PermissionGroup {
  module: string;
  items: Permission[];
}

/**
 * Rôles : ce sont eux qui portent les permissions, les comptes ne font que les recevoir.
 *
 * <p>Les rôles système (`ADMIN`, `EDITOR`) sont recréés et réalignés à chaque démarrage du
 * backend : ni renommables, ni supprimables, et toute modification de leurs permissions serait
 * écrasée au prochain redémarrage — l'interface les signale et bloque leur édition.
 */
@Component({
  selector: 'app-roles',
  imports: [
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    HasPermission,
  ],
  templateUrl: './roles.html',
})
export default class Roles implements OnInit {
  private readonly roles = inject(RoleService);
  private readonly permissions = inject(PermissionService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  protected readonly items = signal<Role[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  /** Permissions disponibles, groupées par module pour le sélecteur. */
  protected readonly permissionGroups = signal<PermissionGroup[]>([]);

  protected readonly dialogOpen = signal(false);
  protected readonly editing = signal<Role | null>(null);
  protected readonly formError = signal('');

  protected search = '';

  private lastEvent: TableLazyLoadEvent = { first: 0, rows: 10 };
  private readonly searchInput = new Subject<void>();

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Z0-9_]*$/)]],
    description: [''],
    permissionIds: [[] as number[]],
  });

  constructor() {
    this.searchInput.pipe(debounceTime(350)).subscribe(() => this.reload());
  }

  ngOnInit(): void {
    if (this.auth.has('READ_PERMISSION')) {
      this.permissions.listAll('module').subscribe({
        next: (page) => this.permissionGroups.set(groupByModule(page.content)),
        error: () => void 0,
      });
    }
  }

  // ──────────────── Liste ────────────────

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

    this.roles
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

  // ──────────────── Formulaire ────────────────

  protected openCreate(): void {
    this.editing.set(null);
    this.formError.set('');
    this.form.reset({ name: '', description: '', permissionIds: [] });
    this.form.controls.name.enable();
    this.dialogOpen.set(true);
  }

  protected openEdit(role: Role): void {
    this.editing.set(role);
    this.formError.set('');
    this.form.reset({
      name: role.name,
      description: role.description ?? '',
      permissionIds: role.permissions.map((permission) => permission.id),
    });
    // Le nom d'un rôle système est référencé côté backend : il n'est pas renommable.
    if (role.system) {
      this.form.controls.name.disable();
    } else {
      this.form.controls.name.enable();
    }
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
      description: value.description.trim() || null,
      permissionIds: value.permissionIds,
    };

    this.saving.set(true);
    this.formError.set('');

    const current = this.editing();
    const request = current ? this.roles.update(current.id, payload) : this.roles.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogOpen.set(false);
        this.toast.add({ severity: 'success', summary: current ? 'Rôle mis à jour' : 'Rôle créé' });
        this.load(this.lastEvent);
        // Modifier un rôle que l'on porte soi-même change ses propres droits.
        if (current && this.auth.hasRole(current.name)) {
          this.auth.loadProfile().subscribe({ error: () => void 0 });
        }
      },
      error: (failure: unknown) => {
        this.saving.set(false);
        const fields = apiFieldErrors(failure);
        this.formError.set(Object.values(fields)[0] ?? apiErrorMessage(failure));
      },
    });
  }

  protected confirmDelete(role: Role): void {
    this.confirmation.confirm({
      header: 'Supprimer ce rôle',
      message: `Le rôle « ${role.name} » sera supprimé. Le backend refusera s'il est encore attribué à un compte.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.roles.delete(role.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Rôle supprimé' });
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

/** Regroupe les permissions par module, en conservant l'ordre alphabétique du backend. */
function groupByModule(permissions: Permission[]): PermissionGroup[] {
  const groups = new Map<string, Permission[]>();
  for (const permission of permissions) {
    const module = permission.module || 'AUTRES';
    const existing = groups.get(module);
    if (existing) {
      existing.push(permission);
    } else {
      groups.set(module, [permission]);
    }
  }
  return [...groups.entries()]
    .map(([module, items]) => ({ module, items }))
    .sort((a, b) => a.module.localeCompare(b.module));
}
