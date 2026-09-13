import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { MediaAsset } from '../../../core/models/media.model';
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_SEVERITY,
  Project,
  ProjectStatus,
} from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { imagekitUrl } from '../../../core/utils/imagekit';
import { apiErrorMessage, apiFieldErrors } from '../../../core/utils/http.util';
import MediaLibrary from '../media-library/media-library';

/** Prestations proposées par défaut au champ « Services ». */
const COMMON_SERVICES = [
  'Web Design',
  'Développement',
  'SEO',
  'Refonte',
  'E-commerce',
  'Hébergement',
  'Maintenance',
  'Rédaction',
  'Identité visuelle',
];

/** Ce que le sélecteur d'images vient remplir. */
type PickerTarget = 'cover' | 'gallery';

/**
 * Rédaction d'une réalisation : `/admin/projets/nouveau` en création,
 * `/admin/projets/:id` en modification.
 *
 * <p>Un écran plein plutôt qu'une boîte de dialogue comme les autres ressources : le texte
 * d'une étude de cas et sa galerie ont besoin de la hauteur de la page.
 *
 * <p>Deux champs restent la main du backend : le slug, dérivé du titre et rendu unique
 * quand on le laisse vide, et la date de publication, posée au passage en « Publié ». Le
 * rang d'affichage n'est pas saisissable non plus — il se règle aux flèches de la liste,
 * qui permutent les réalisations sans jamais créer deux rangs identiques.
 */
@Component({
  selector: 'app-project-editor',
  imports: [
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    AutoCompleteModule,
    ToggleSwitchModule,
    DialogModule,
    TagModule,
    SkeletonModule,
    MediaLibrary,
  ],
  templateUrl: './project-editor.html',
})
export default class ProjectEditor implements OnInit {
  private readonly projects = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(MessageService);
  private readonly formBuilder = inject(FormBuilder);

  /** Réalisation en cours de modification ; `null` tant qu'on crée. */
  protected readonly project = signal<Project | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly notFound = signal(false);
  protected readonly formError = signal('');

  protected readonly pickerOpen = signal(false);
  protected readonly serviceSuggestions = signal<string[]>([]);

  protected readonly statusLabels = PROJECT_STATUS_LABELS;
  protected readonly statusSeverity = PROJECT_STATUS_SEVERITY;
  protected readonly statusOptions = PROJECT_STATUSES.map((status) => ({
    label: PROJECT_STATUS_LABELS[status],
    value: status,
  }));

  protected readonly preview = (publicId: string) => imagekitUrl(publicId, 400);

  private projectId: number | null = null;
  private pickerTarget: PickerTarget = 'cover';

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    slug: [''],
    clientLabel: ['', [Validators.maxLength(255)]],
    summary: [''],
    description: [''],
    sector: ['', [Validators.maxLength(100)]],
    websiteUrl: ['', [Validators.maxLength(500)]],
    icon: ['pi pi-desktop', [Validators.maxLength(100)]],
    coverPublicId: [''],
    galleryPublicIds: [[] as string[]],
    services: [[] as string[]],
    status: ['DRAFT' as ProjectStatus],
    caseStudy: [false],
    featured: [false],
  });

  constructor() {
    // Une étude de cas affiche son texte en entier sur la page publique : la publier sans
    // description laisserait un bloc vide en ligne. La contrainte ne vaut donc que dans ce
    // cas, et se lève dès que la case est décochée.
    this.form.controls.caseStudy.valueChanges.subscribe((isCaseStudy) => {
      const description = this.form.controls.description;
      description.setValidators(isCaseStudy ? [Validators.required] : []);
      description.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param === null) {
      return;
    }

    this.projectId = Number(param);
    this.loadProject(this.projectId);
  }

  private loadProject(id: number): void {
    this.loading.set(true);
    this.projects.getById(id).subscribe({
      next: (project) => {
        this.project.set(project);
        this.form.reset({
          title: project.title,
          slug: project.slug,
          clientLabel: project.clientLabel ?? '',
          summary: project.summary ?? '',
          description: project.description ?? '',
          sector: project.sector ?? '',
          websiteUrl: project.websiteUrl ?? '',
          icon: project.icon ?? 'pi pi-desktop',
          coverPublicId: project.coverPublicId ?? '',
          galleryPublicIds: [...(project.galleryPublicIds ?? [])],
          services: [...(project.services ?? [])],
          status: project.status,
          caseStudy: project.caseStudy,
          featured: project.featured,
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
      },
    });
  }

  // ──────────────── Services ────────────────

  /**
   * Le champ accepte du texte libre : la « recherche » ne fait que proposer les prestations
   * courantes et celles déjà posées, l'API n'exposant pas de référentiel.
   */
  protected searchServices(event: { query: string }): void {
    const query = event.query.toLowerCase();
    const known = [...new Set([...COMMON_SERVICES, ...this.form.controls.services.value])];
    this.serviceSuggestions.set(known.filter((service) => service.toLowerCase().includes(query)));
  }

  // ──────────────── Images ────────────────

  protected openPicker(target: PickerTarget): void {
    this.pickerTarget = target;
    this.pickerOpen.set(true);
  }

  protected onPicked(asset: MediaAsset): void {
    if (this.pickerTarget === 'cover') {
      this.form.controls.coverPublicId.setValue(asset.publicId);
    } else {
      const gallery = this.form.controls.galleryPublicIds.value;
      if (!gallery.includes(asset.publicId)) {
        this.form.controls.galleryPublicIds.setValue([...gallery, asset.publicId]);
      }
    }
    this.form.markAsDirty();
    this.pickerOpen.set(false);
  }

  protected clearCover(): void {
    this.form.controls.coverPublicId.setValue('');
    this.form.markAsDirty();
  }

  protected removeFromGallery(publicId: string): void {
    this.form.controls.galleryPublicIds.setValue(
      this.form.controls.galleryPublicIds.value.filter((item) => item !== publicId),
    );
    this.form.markAsDirty();
  }

  // ──────────────── Enregistrement ────────────────

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      this.formError.set(
        this.form.controls.description.invalid
          ? 'Une étude de cas doit porter une description : c’est ce que la page publique affiche.'
          : 'Vérifiez les champs signalés.',
      );
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      title: value.title.trim(),
      slug: value.slug.trim() || null,
      clientLabel: value.clientLabel.trim() || null,
      summary: value.summary.trim() || null,
      description: value.description.trim() || null,
      sector: value.sector.trim() || null,
      websiteUrl: value.websiteUrl.trim() || null,
      icon: value.icon.trim() || null,
      coverPublicId: value.coverPublicId.trim() || null,
      galleryPublicIds: value.galleryPublicIds,
      services: value.services.map((service) => service.trim()).filter(Boolean),
      status: value.status,
      caseStudy: value.caseStudy,
      featured: value.featured,
    };

    this.saving.set(true);
    this.formError.set('');

    const id = this.projectId;
    const request = id === null ? this.projects.create(payload) : this.projects.update(id, payload);

    request.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.toast.add({
          severity: 'success',
          summary: id === null ? 'Réalisation créée' : 'Réalisation mise à jour',
          detail:
            saved.status === 'PUBLISHED'
              ? 'En ligne sur le portfolio.'
              : 'Conservée en brouillon, invisible du site.',
        });
        this.router.navigate(['/admin/projets']);
      },
      error: (failure: unknown) => {
        this.saving.set(false);
        const fields = apiFieldErrors(failure);
        const detail = Object.values(fields)[0];
        this.formError.set(detail ?? apiErrorMessage(failure));
      },
    });
  }
}
