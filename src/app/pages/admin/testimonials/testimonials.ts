import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime } from 'rxjs';

import { HasPermission } from '../../../core/directives/has-permission';
import { MediaAsset } from '../../../core/models/media.model';
import {
  TESTIMONIAL_STATUSES,
  TESTIMONIAL_STATUS_LABELS,
  TESTIMONIAL_STATUS_SEVERITY,
  Testimonial,
  TestimonialStatus,
} from '../../../core/models/testimonial.model';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectService } from '../../../core/services/project.service';
import { TestimonialService } from '../../../core/services/testimonial.service';
import { imagekitUrl } from '../../../core/utils/imagekit';
import { apiErrorMessage, apiFieldErrors } from '../../../core/utils/http.util';
import MediaLibrary from '../media-library/media-library';

/** Longueur maximale d'un témoignage, alignée sur la validation du backend. */
const CONTENT_MAX = 2000;

/**
 * Témoignages clients : liste, réordonnancement, création et modification en boîte de
 * dialogue, suppression.
 *
 * <p>Une boîte de dialogue suffit ici, là où les réalisations et les articles ont un écran
 * plein : un témoignage tient en quelques lignes.
 *
 * <p>Le backend refuse de publier un témoignage sans le consentement du client ; le
 * formulaire devance ce refus en exigeant la case dès que le statut passe à « Publié ».
 */
@Component({
  selector: 'app-testimonials-admin',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RatingModule,
    CheckboxModule,
    ToggleSwitchModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    HasPermission,
    MediaLibrary,
  ],
  templateUrl: './testimonials.html',
})
export default class TestimonialsAdmin implements OnInit {
  private readonly testimonials = inject(TestimonialService);
  private readonly projects = inject(ProjectService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly items = signal<Testimonial[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly reordering = signal(false);

  protected readonly dialogOpen = signal(false);
  protected readonly pickerOpen = signal(false);
  /** Témoignage en cours de modification ; `null` en création. */
  protected readonly editing = signal<Testimonial | null>(null);
  protected readonly formError = signal('');

  /** Réalisations proposées au rattachement, brouillons compris. */
  protected readonly projectOptions = signal<{ label: string; value: number }[]>([]);

  protected readonly contentMax = CONTENT_MAX;
  protected readonly statusLabels = TESTIMONIAL_STATUS_LABELS;
  protected readonly statusSeverity = TESTIMONIAL_STATUS_SEVERITY;
  protected readonly statusOptions = TESTIMONIAL_STATUSES.map((status) => ({
    label: TESTIMONIAL_STATUS_LABELS[status],
    value: status,
  }));
  protected readonly photo = (publicId: string | null) => imagekitUrl(publicId, 400);
  protected readonly byline = (item: Testimonial) =>
    [item.authorRole, item.company].filter(Boolean).join(', ');

  /** Tri courant ; les flèches n'ont de sens que sur le rang d'affichage. */
  protected readonly sortedByOrder = signal(true);
  protected readonly canReorder = computed(() => this.sortedByOrder() && !this.reordering());

  protected search = '';

  private lastEvent: TableLazyLoadEvent = { first: 0, rows: 10 };
  private readonly searchInput = new Subject<void>();

  protected readonly form = this.formBuilder.group({
    authorName: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    authorRole: this.formBuilder.nonNullable.control('', [Validators.maxLength(255)]),
    company: this.formBuilder.nonNullable.control('', [Validators.maxLength(255)]),
    photoPublicId: this.formBuilder.nonNullable.control(''),
    rating: this.formBuilder.control<number | null>(5),
    content: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(CONTENT_MAX),
    ]),
    projectId: this.formBuilder.control<number | null>(null),
    consentObtained: this.formBuilder.nonNullable.control(false),
    status: this.formBuilder.nonNullable.control<TestimonialStatus>('DRAFT'),
    featured: this.formBuilder.nonNullable.control(false),
  });

  constructor() {
    this.searchInput.pipe(debounceTime(350)).subscribe(() => this.reload());

    // Publier exige le consentement : la case devient obligatoire dès que le statut passe à
    // « Publié », et cesse de l'être en brouillon, où l'accord peut encore être en attente.
    this.form.controls.status.valueChanges.subscribe((status) => {
      const consent = this.form.controls.consentObtained;
      consent.setValidators(status === 'PUBLISHED' ? [Validators.requiredTrue] : []);
      consent.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Le sélecteur de réalisations n'est utile qu'avec `READ_PROJECT` ; sans, l'appel
    // repartirait en 403 et le champ reste simplement vide.
    if (this.auth.has('READ_PROJECT')) {
      this.projects.listAll('title').subscribe({
        next: (page) =>
          this.projectOptions.set(
            page.content.map((project) => ({
              label: project.status === 'DRAFT' ? `${project.title} (brouillon)` : project.title,
              value: project.id,
            })),
          ),
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
    const field = sortField ?? 'displayOrder';
    this.sortedByOrder.set(field === 'displayOrder');

    this.testimonials
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

  /** Déplace un témoignage d'un cran, `direction` valant -1 (monter) ou 1 (descendre). */
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

    this.testimonials.reorder(reordered.map((item) => item.id)).subscribe({
      next: () => {
        this.reordering.set(false);
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

  // ──────────────── Formulaire ────────────────

  protected openCreate(): void {
    this.editing.set(null);
    this.formError.set('');
    this.form.reset({
      authorName: '',
      authorRole: '',
      company: '',
      photoPublicId: '',
      rating: 5,
      content: '',
      projectId: null,
      consentObtained: false,
      status: 'DRAFT',
      featured: false,
    });
    this.dialogOpen.set(true);
  }

  protected openEdit(item: Testimonial): void {
    this.editing.set(item);
    this.formError.set('');
    this.form.reset({
      authorName: item.authorName,
      authorRole: item.authorRole ?? '',
      company: item.company ?? '',
      photoPublicId: item.photoPublicId ?? '',
      rating: item.rating,
      content: item.content,
      projectId: item.projectId,
      consentObtained: item.consentObtained,
      status: item.status,
      featured: item.featured,
    });
    this.dialogOpen.set(true);
  }

  protected onPicked(asset: MediaAsset): void {
    this.form.controls.photoPublicId.setValue(asset.publicId);
    this.form.markAsDirty();
    this.pickerOpen.set(false);
  }

  protected clearPhoto(): void {
    this.form.controls.photoPublicId.setValue('');
    this.form.markAsDirty();
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      this.formError.set(
        this.form.controls.consentObtained.invalid
          ? 'Un témoignage ne peut être publié qu’avec l’accord du client.'
          : 'Vérifiez les champs signalés.',
      );
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      authorName: value.authorName.trim(),
      authorRole: value.authorRole.trim() || null,
      company: value.company.trim() || null,
      photoPublicId: value.photoPublicId.trim() || null,
      // La note s'efface en recliquant sur l'étoile sélectionnée : 0 ou null valent « sans note ».
      rating: value.rating || null,
      content: value.content.trim(),
      projectId: value.projectId,
      consentObtained: value.consentObtained,
      status: value.status,
      featured: value.featured,
    };

    this.saving.set(true);
    this.formError.set('');

    const current = this.editing();
    const request = current
      ? this.testimonials.update(current.id, payload)
      : this.testimonials.create(payload);

    request.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.dialogOpen.set(false);
        this.toast.add({
          severity: 'success',
          summary: current ? 'Témoignage mis à jour' : 'Témoignage ajouté',
          detail:
            saved.status === 'PUBLISHED'
              ? 'En ligne sur la page des témoignages.'
              : 'Conservé en brouillon, invisible du site.',
        });
        this.load(this.lastEvent);
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

  protected confirmDelete(item: Testimonial): void {
    this.confirmation.confirm({
      header: 'Supprimer ce témoignage',
      message: `Le témoignage de « ${item.authorName} » sera définitivement supprimé. Sa photo reste dans la bibliothèque.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.testimonials.delete(item.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Témoignage supprimé' });
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
