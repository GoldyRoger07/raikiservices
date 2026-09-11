import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime } from 'rxjs';

import { HasPermission } from '../../../core/directives/has-permission';
import { MediaAsset } from '../../../core/models/media.model';
import { MediaService } from '../../../core/services/media.service';
import { cloudinaryUrl } from '../../../core/utils/cloudinary';
import { apiErrorMessage } from '../../../core/utils/http.util';
import { ACCEPTED_IMAGE_TYPES, formatBytes, prepareImage } from '../../../core/utils/image-file';

/** Un fichier en cours d'envoi, le temps qu'il rejoigne la grille. */
interface PendingUpload {
  name: string;
  percent: number;
}

/** Images affichées par page. Quatre rangées de six sur grand écran. */
const PAGE_SIZE = 24;

/**
 * Bibliothèque d'images : `/admin/medias`, et sélecteur dans l'éditeur de réalisations.
 *
 * <p>Un seul composant pour les deux usages. `selectionMode` masque l'en-tête de page et
 * fait de chaque vignette un bouton qui émet `picked` — dupliquer la grille aurait fait
 * diverger deux écrans qui doivent montrer exactement le même contenu.
 *
 * <p>Le fichier ne transite pas par le backend : il est réduit ici, téléversé directement
 * chez Cloudinary, puis déclaré. Voir `MediaService.upload`.
 */
@Component({
  selector: 'app-media-library',
  imports: [
    DatePipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
    ProgressBarModule,
    TooltipModule,
    HasPermission,
  ],
  templateUrl: './media-library.html',
  styleUrl: './media-library.css',
})
export default class MediaLibrary implements OnInit {
  private readonly media = inject(MediaService);
  private readonly toast = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  /** En sélecteur : pas d'en-tête de page, et les vignettes deviennent cliquables. */
  readonly selectionMode = input(false);

  /** Image choisie en mode sélecteur. */
  readonly picked = output<MediaAsset>();

  protected readonly items = signal<MediaAsset[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly uploads = signal<PendingUpload[]>([]);
  protected readonly first = signal(0);

  protected readonly acceptedTypes = ACCEPTED_IMAGE_TYPES;
  protected readonly pageSize = PAGE_SIZE;
  protected readonly formatBytes = formatBytes;
  protected readonly thumbnail = (asset: MediaAsset) =>
    cloudinaryUrl(asset.publicId, 400) || asset.secureUrl;

  protected search = '';
  protected dragging = false;

  private readonly searchInput = new Subject<void>();

  constructor() {
    this.searchInput.pipe(debounceTime(350)).subscribe(() => this.load(0));
  }

  ngOnInit(): void {
    this.load(0);
  }

  protected onSearchChange(): void {
    this.searchInput.next();
  }

  protected load(first: number): void {
    this.first.set(first);
    this.loading.set(true);

    this.media
      .list({
        page: Math.floor(first / PAGE_SIZE),
        size: PAGE_SIZE,
        sortField: 'uploadedAt',
        sortOrder: 'desc',
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

  // ──────────────── Envoi ────────────────

  protected onFilesChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadAll(input.files);
    // Sans cette remise à zéro, choisir deux fois de suite le même fichier ne déclenche
    // aucun évènement : la valeur du champ n'aurait pas changé.
    input.value = '';
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.uploadAll(event.dataTransfer?.files ?? null);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  protected onDragLeave(): void {
    this.dragging = false;
  }

  /**
   * Envoie les fichiers un par un.
   *
   * <p>Chacun a sa propre ligne de progression et son propre sort : un fichier trop lourd
   * ou refusé par Cloudinary n'interrompt pas les autres.
   */
  private uploadAll(files: FileList | null): void {
    if (!files?.length) {
      return;
    }
    for (const file of Array.from(files)) {
      void this.uploadOne(file);
    }
  }

  private async uploadOne(file: File): Promise<void> {
    const pending: PendingUpload = { name: file.name, percent: 0 };
    this.uploads.update((current) => [...current, pending]);

    let prepared: File;
    try {
      prepared = await prepareImage(file);
    } catch (failure: unknown) {
      this.finishUpload(pending);
      this.toast.add({
        severity: 'warn',
        summary: 'Fichier ignoré',
        detail: apiErrorMessage(failure),
      });
      return;
    }

    this.media.upload(prepared).subscribe({
      next: (event) => {
        if (event.kind === 'progress') {
          this.updateProgress(pending, event.percent);
          return;
        }
        this.finishUpload(pending);
        this.toast.add({ severity: 'success', summary: `« ${file.name} » envoyée` });
        // On revient en tête de liste : le tri est antichronologique, la nouvelle image y est.
        this.load(0);
      },
      error: (failure: unknown) => {
        this.finishUpload(pending);
        this.toast.add({
          severity: 'error',
          summary: 'Envoi impossible',
          detail: apiErrorMessage(failure),
        });
      },
    });
  }

  private updateProgress(pending: PendingUpload, percent: number): void {
    this.uploads.update((current) =>
      current.map((item) => (item === pending ? { ...item, percent } : item)),
    );
  }

  private finishUpload(pending: PendingUpload): void {
    this.uploads.update((current) => current.filter((item) => item.name !== pending.name));
  }

  // ──────────────── Actions ────────────────

  protected choose(asset: MediaAsset): void {
    if (this.selectionMode()) {
      this.picked.emit(asset);
    }
  }

  /** Met à jour le texte alternatif, saisi directement sous la vignette. */
  protected saveAlt(asset: MediaAsset, alt: string): void {
    const trimmed = alt.trim();
    if (trimmed === (asset.alt ?? '')) {
      return;
    }
    this.media.update(asset.id, { alt: trimmed || null }).subscribe({
      next: (updated) =>
        this.items.update((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        ),
      error: (failure: unknown) =>
        this.toast.add({
          severity: 'error',
          summary: 'Enregistrement impossible',
          detail: apiErrorMessage(failure),
        }),
    });
  }

  protected copyId(asset: MediaAsset): void {
    void navigator.clipboard?.writeText(asset.publicId).then(() =>
      this.toast.add({
        severity: 'info',
        summary: 'Identifiant copié',
        detail: asset.publicId,
      }),
    );
  }

  protected confirmDelete(asset: MediaAsset): void {
    this.confirmation.confirm({
      header: 'Supprimer cette image',
      message: `« ${asset.originalFilename ?? asset.publicId} » sera définitivement supprimée, ici et chez Cloudinary.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.media.delete(asset.id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Image supprimée' });
            this.load(this.first());
          },
          // Le backend refuse en 409 tant qu'une réalisation affiche l'image, et nomme
          // lesquelles : son message est plus utile qu'un texte générique.
          error: (failure: unknown) =>
            this.toast.add({
              severity: 'error',
              summary: 'Suppression impossible',
              detail: apiErrorMessage(failure),
              life: 8000,
            }),
        }),
    });
  }
}
