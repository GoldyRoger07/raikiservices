import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

import {
  BLOG_STATUSES,
  BLOG_STATUS_LABELS,
  BLOG_STATUS_SEVERITY,
  BlogPost,
  BlogStatus,
} from '../../../core/models/blog.model';
import { MediaAsset } from '../../../core/models/media.model';
import { AuthService } from '../../../core/services/auth.service';
import { BlogService } from '../../../core/services/blog.service';
import { UserService } from '../../../core/services/user.service';
import { imagekitUrl } from '../../../core/utils/imagekit';
import { apiErrorMessage, apiFieldErrors } from '../../../core/utils/http.util';
import MediaLibrary from '../media-library/media-library';

/** Choix du sélecteur d'auteur : l'identifiant du compte et son nom affichable. */
interface AuthorOption {
  id: number;
  name: string;
}

/**
 * Rédaction d'un article : `/admin/blog/nouveau` en création, `/admin/blog/:id` en
 * modification.
 *
 * <p>Un écran plein plutôt qu'une boîte de dialogue comme les autres ressources : le corps
 * d'un article est un texte long, qui a besoin de la hauteur de la page.
 *
 * <p>Deux champs restent la main du backend : le slug, dérivé du titre et rendu unique quand
 * on le laisse vide, et la date de publication, posée au passage en « Publié ». Publier
 * déclenche aussi une notification — mais une seule fois, pas à chaque enregistrement
 * ultérieur.
 */
@Component({
  selector: 'app-blog-editor',
  imports: [
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    AutoCompleteModule,
    DialogModule,
    TagModule,
    SkeletonModule,
    MediaLibrary,
  ],
  templateUrl: './blog-editor.html',
})
export default class BlogEditor implements OnInit {
  private readonly blog = inject(BlogService);
  private readonly users = inject(UserService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(MessageService);
  private readonly formBuilder = inject(FormBuilder);

  /** Article en cours de modification ; `null` tant qu'on crée. */
  protected readonly post = signal<BlogPost | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly notFound = signal(false);
  protected readonly formError = signal('');

  protected readonly authors = signal<AuthorOption[]>([]);
  /** Suggestions du champ des étiquettes : celles déjà posées sur l'article ouvert. */
  protected readonly tagSuggestions = signal<string[]>([]);

  protected readonly statusLabels = BLOG_STATUS_LABELS;
  protected readonly statusSeverity = BLOG_STATUS_SEVERITY;
  protected readonly statusOptions = BLOG_STATUSES.map((status) => ({
    label: BLOG_STATUS_LABELS[status],
    value: status,
  }));

  /** Le sélecteur d'auteur n'a de sens que si la liste des comptes est accessible. */
  protected readonly canPickAuthor = computed(() => this.auth.has('READ_USER'));

  /** Le sélecteur de couverture liste la bibliothèque : sans cette permission, il resterait vide. */
  protected readonly canPickCover = computed(() => this.auth.has('READ_MEDIA'));

  protected readonly pickerOpen = signal(false);

  /**
   * Aperçu de la couverture. Passe par `imagekitUrl`, qui laisse intactes les adresses
   * historiques (`/img/…`, URL complètes) saisies avant la bibliothèque d'images.
   */
  protected readonly preview = (source: string) => imagekitUrl(source, 800);

  private postId: number | null = null;

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    slug: [''],
    excerpt: [''],
    content: [''],
    coverImage: [''],
    category: ['', [Validators.maxLength(100)]],
    status: ['DRAFT' as BlogStatus],
    authorId: [null as number | null],
    tags: [[] as string[]],
  });

  ngOnInit(): void {
    if (this.canPickAuthor()) {
      this.users.listAll('username').subscribe({
        next: (page) =>
          this.authors.set(
            page.content.map((user) => ({
              id: user.id,
              name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username,
            })),
          ),
        error: () => void 0,
      });
    }

    const param = this.route.snapshot.paramMap.get('id');
    if (param === null) {
      return;
    }

    this.postId = Number(param);
    this.loadPost(this.postId);
  }

  private loadPost(id: number): void {
    this.loading.set(true);
    this.blog.getById(id).subscribe({
      next: (post) => {
        this.post.set(post);
        this.tagSuggestions.set(post.tags ?? []);
        this.form.reset({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? '',
          content: post.content ?? '',
          coverImage: post.coverImage ?? '',
          category: post.category ?? '',
          status: post.status,
          authorId: post.authorId,
          tags: [...(post.tags ?? [])],
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
      },
    });
  }

  // ──────────────── Étiquettes ────────────────

  /**
   * Le champ des étiquettes accepte du texte libre : la « recherche » ne fait que proposer
   * les valeurs déjà employées sur l'article, l'API n'exposant pas de référentiel.
   */
  protected searchTags(event: { query: string }): void {
    const query = event.query.toLowerCase();
    const known = this.post()?.tags ?? [];
    this.tagSuggestions.set(known.filter((tag) => tag.toLowerCase().includes(query)));
  }

  // ──────────────── Couverture ────────────────

  /** Retient le chemin ImageKit, comme les réalisations : l'adresse se recompose à l'affichage. */
  protected onPicked(asset: MediaAsset): void {
    this.form.controls.coverImage.setValue(asset.publicId);
    this.form.markAsDirty();
    this.pickerOpen.set(false);
  }

  protected clearCover(): void {
    this.form.controls.coverImage.setValue('');
    this.form.markAsDirty();
  }

  // ──────────────── Enregistrement ────────────────

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      title: value.title.trim(),
      slug: value.slug.trim() || null,
      excerpt: value.excerpt.trim() || null,
      content: value.content.trim() || null,
      coverImage: value.coverImage.trim() || null,
      category: value.category.trim() || null,
      status: value.status,
      authorId: value.authorId,
      tags: value.tags.map((tag) => tag.trim()).filter(Boolean),
    };

    this.saving.set(true);
    this.formError.set('');

    const id = this.postId;
    const request = id === null ? this.blog.create(payload) : this.blog.update(id, payload);

    request.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.toast.add({
          severity: 'success',
          summary: id === null ? 'Article créé' : 'Article mis à jour',
          detail:
            saved.status === 'PUBLISHED'
              ? `En ligne à l'adresse /${saved.slug}.`
              : 'Conservé en brouillon.',
        });
        this.router.navigate(['/admin/blog']);
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
