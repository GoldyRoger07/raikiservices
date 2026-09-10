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
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime } from 'rxjs';

import { HasPermission } from '../../../core/directives/has-permission';
import { Role } from '../../../core/models/role.model';
import {
  USER_STATUSES,
  USER_STATUS_LABELS,
  USER_STATUS_SEVERITY,
  User,
} from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { RoleService } from '../../../core/services/role.service';
import { UserService } from '../../../core/services/user.service';
import { apiErrorMessage, apiFieldErrors } from '../../../core/utils/http.util';

/**
 * Comptes du back-office : création, modification, attribution des rôles, suppression.
 *
 * <p>Les rôles portent les permissions ; c'est donc ici que se décide ce qu'un compte peut
 * faire. Le backend refuse qu'un compte se supprime lui-même, et empêche de retirer le dernier
 * administrateur — l'interface ne fait que devancer ces refus quand elle le peut.
 */
@Component({
  selector: 'app-users',
  imports: [
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    MultiSelectModule,
    ToggleSwitchModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    HasPermission,
  ],
  templateUrl: './users.html',
})
export default class Users implements OnInit {
  private readonly users = inject(UserService);
  private readonly roles = inject(RoleService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly items = signal<User[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);

  /** Rôles disponibles, chargés une fois pour alimenter le sélecteur du formulaire. */
  protected readonly availableRoles = signal<Role[]>([]);

  protected readonly dialogOpen = signal(false);
  /** Compte en cours de modification ; `null` en création. */
  protected readonly editing = signal<User | null>(null);
  protected readonly formError = signal('');

  protected readonly statusLabels = USER_STATUS_LABELS;
  protected readonly statusSeverity = USER_STATUS_SEVERITY;
  protected readonly statusOptions = USER_STATUSES.map((status) => ({
    label: USER_STATUS_LABELS[status],
    value: status,
  }));

  protected search = '';

  private lastEvent: TableLazyLoadEvent = { first: 0, rows: 10 };
  private readonly searchInput = new Subject<void>();

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8)]],
    firstName: [''],
    lastName: [''],
    phone: [''],
    position: [''],
    bio: [''],
    status: ['ACTIVE' as (typeof USER_STATUSES)[number]],
    enabled: [true],
    roleIds: [[] as number[]],
  });

  constructor() {
    this.searchInput.pipe(debounceTime(350)).subscribe(() => this.reload());
  }

  ngOnInit(): void {
    // Le sélecteur de rôles n'est utile qu'à qui peut créer ou modifier un compte ; sans
    // `READ_ROLE`, l'appel repartirait en 403 sans rien apporter.
    if (this.auth.has('READ_ROLE')) {
      this.roles.listAll('name').subscribe({
        next: (page) => this.availableRoles.set(page.content),
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

    this.users
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

  // ──────────────── Formulaire ────────────────

  protected openCreate(): void {
    this.editing.set(null);
    this.formError.set('');
    this.form.reset({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      position: '',
      bio: '',
      status: 'ACTIVE',
      enabled: true,
      roleIds: [],
    });
    // Obligatoire à la création seulement : à la modification, un champ vide conserve
    // le mot de passe actuel.
    this.form.controls.password.addValidators(Validators.required);
    this.form.controls.password.updateValueAndValidity();
    this.dialogOpen.set(true);
  }

  protected openEdit(user: User): void {
    this.editing.set(user);
    this.formError.set('');
    this.form.reset({
      username: user.username,
      email: user.email,
      password: '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
      position: user.position ?? '',
      bio: user.bio ?? '',
      status: user.status,
      enabled: user.enabled,
      roleIds: user.roles.map((role) => role.id),
    });
    this.form.controls.password.removeValidators(Validators.required);
    this.form.controls.password.updateValueAndValidity();
    this.dialogOpen.set(true);
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      username: value.username.trim(),
      email: value.email.trim(),
      firstName: value.firstName.trim() || null,
      lastName: value.lastName.trim() || null,
      phone: value.phone.trim() || null,
      position: value.position.trim() || null,
      bio: value.bio.trim() || null,
      status: value.status,
      enabled: value.enabled,
      roleIds: value.roleIds,
    };

    this.saving.set(true);
    this.formError.set('');

    const current = this.editing();
    const request = current
      ? // Mot de passe laissé vide : on l'omet, le backend conserve alors l'actuel.
        this.users.update(current.id, {
          ...payload,
          password: value.password.trim() || null,
        })
      : this.users.create({ ...payload, password: value.password });

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogOpen.set(false);
        this.toast.add({
          severity: 'success',
          summary: current ? 'Compte mis à jour' : 'Compte créé',
        });
        this.load(this.lastEvent);
        // Se modifier soi-même change ses propres droits : on recharge le profil pour que
        // le menu et les boutons reflètent immédiatement la nouvelle situation.
        if (current && current.id === this.auth.user()?.id) {
          this.auth.loadProfile().subscribe({ error: () => void 0 });
        }
      },
      error: (failure: unknown) => {
        this.saving.set(false);
        const fields = apiFieldErrors(failure);
        const detail = Object.values(fields)[0];
        this.formError.set(detail ?? apiErrorMessage(failure));
      },
    });
  }

  // ──────────────── Suppression ────────────────

  /** Le backend refuse qu'un compte se supprime lui-même : le bouton est masqué en amont. */
  protected isSelf(user: User): boolean {
    return user.id === this.auth.user()?.id;
  }

  protected confirmDelete(user: User): void {
    this.confirmation.confirm({
      header: 'Supprimer ce compte',
      message: `Le compte « ${user.username} » et ses sessions ouvertes seront supprimés.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.users.delete(user.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Compte supprimé' });
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
