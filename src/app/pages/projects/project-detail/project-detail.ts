import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Image } from 'primeng/image';

import { Container } from '../../../components/container/container';
import { CtaSection } from '../../../components/cta-section/cta-section';
import { Footer } from '../../../components/footer/footer';
import { Header } from '../../../components/header/header';
import { ProjectCard } from '../../../components/project-card/project-card';
import { SeparatorDesign } from '../../../components/separator-design/separator-design';
import { seoConfig } from '../../../config/seo';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import {
  CLOUDINARY_CARD_SIZES,
  cloudinarySrcset,
  cloudinaryUrl,
} from '../../../core/utils/cloudinary';
import { SeoService } from '../../../services/seo.service';
// Ces trois fonctions n'ont rien de propre au blog : elles traitent un texte saisi dans une
// zone de saisie libre, exactement comme la description d'une réalisation.
import { formatFrenchDate, looksLikeHtml, toParagraphs } from '../../blog/blog-content';

/** Nombre de réalisations proposées en bas de page. */
const RELATED_COUNT = 3;

/** Identifiant du `<script>` de données structurées, pour le retrouver et le retirer. */
const JSON_LD_ID = 'project-jsonld';

/**
 * Réalisation en détail : `/portfolio/:slug`.
 *
 * <p>Chargée depuis `/public/v1/projects/:slug`, qui ne connaît que les réalisations
 * publiées — un brouillon répond 404 ici, et la page affiche le même message qu'une adresse
 * inventée.
 *
 * <p>Le composant est réutilisé quand on passe d'une réalisation à l'autre par les
 * suggestions de bas de page : d'où l'abonnement au `paramMap` plutôt qu'une lecture du
 * `snapshot`, qui ne changerait plus après le premier affichage.
 */
@Component({
  selector: 'app-project-detail',
  imports: [Header, Footer, CtaSection, Container, SeparatorDesign, ProjectCard, RouterLink, Image],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export default class ProjectDetail implements OnInit, OnDestroy {
  private readonly projects = inject(ProjectService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  // `ngOnInit` n'est pas un contexte d'injection : `takeUntilDestroyed` a besoin du `DestroyRef`.
  private readonly destroyRef = inject(DestroyRef);

  protected readonly project = signal<Project | null>(null);
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);

  /** Autres réalisations ; silencieusement vides si l'appel échoue. */
  protected readonly related = signal<Project[]>([]);

  protected readonly sizes = CLOUDINARY_CARD_SIZES;
  protected readonly formatDate = formatFrenchDate;
  protected readonly skeletonLines = [1, 2, 3, 4, 5, 6];

  protected readonly cover = computed(() => cloudinaryUrl(this.project()?.coverPublicId, 1600));
  protected readonly coverSrcset = computed(() => cloudinarySrcset(this.project()?.coverPublicId));

  /**
   * La description est enregistrée telle quelle par le back-office : du HTML est injecté via
   * `[innerHTML]` (Angular l'assainit et retire scripts et gestionnaires d'événements), du
   * texte brut est découpé en paragraphes et interpolé, donc échappé.
   */
  protected readonly isHtml = computed(() => looksLikeHtml(this.project()?.description));
  protected readonly paragraphs = computed(() =>
    this.isHtml() ? [] : toParagraphs(this.project()?.description),
  );

  protected readonly thumbnail = (publicId: string) => cloudinaryUrl(publicId, 800);
  protected readonly fullSize = (publicId: string) => cloudinaryUrl(publicId, 1600);
  protected readonly srcsetOf = (publicId: string) => cloudinarySrcset(publicId);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.load(params.get('slug') ?? '');
    });
  }

  ngOnDestroy(): void {
    this.removeJsonLd();
  }

  private load(slug: string): void {
    this.loading.set(true);
    this.notFound.set(false);
    this.project.set(null);
    this.related.set([]);
    this.removeJsonLd();

    this.projects.getPublishedBySlug(slug).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loading.set(false);
        this.applySeo(project);
        this.loadRelated(project);
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
        // Une adresse inconnue ne doit pas finir dans l'index des moteurs.
        this.seo.update({
          title: 'Réalisation introuvable | RaikiServices',
          description: "Cette réalisation n'existe pas ou n'est plus publiée.",
          path: `/portfolio/${slug}`,
          noindex: true,
        });
      },
    });
  }

  /**
   * Autres réalisations publiées, moins celle qu'on consulte.
   *
   * <p>L'API n'expose pas de notion de « projets similaires » : on reprend simplement les
   * premières de la vitrine, dans l'ordre réglé au back-office.
   */
  private loadRelated(project: Project): void {
    this.projects.listPublished({ page: 0, size: RELATED_COUNT + 1 }).subscribe({
      next: (page) =>
        this.related.set(
          page.content.filter((other) => other.id !== project.id).slice(0, RELATED_COUNT),
        ),
      error: () => this.related.set([]),
    });
  }

  // ──────────────── Métadonnées ────────────────

  private applySeo(project: Project): void {
    const description =
      project.summary?.trim() ||
      firstSentence(project.description) ||
      `${project.title} — une réalisation signée RaikiServices.`;

    this.seo.update({
      title: `${project.title} | Réalisations RaikiServices`,
      description,
      path: `/portfolio/${project.slug}`,
      // Une adresse Cloudinary est déjà absolue : `SeoService` la laisse passer telle quelle.
      image: cloudinaryUrl(project.coverPublicId, 1600) || undefined,
      type: 'article',
    });

    this.setJsonLd(project, description);
  }

  /**
   * Données structurées `CreativeWork`.
   *
   * <p>Elles disent aux moteurs qu'il s'agit d'une réalisation datée, attribuée à l'agence
   * et rattachée à un client. `SeoService` ne gère que les balises `<meta>` : ce bloc est
   * donc posé ici, et retiré au départ de la page pour qu'il ne survive pas à une navigation
   * vers une autre page du site.
   */
  private setJsonLd(project: Project, description: string): void {
    const base = seoConfig.baseUrl.replace(/\/$/, '');
    const image = cloudinaryUrl(project.coverPublicId, 1600);

    const payload = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description,
      image: image ? [image] : undefined,
      url: `${base}/portfolio/${project.slug}`,
      datePublished: project.publishedAt ?? project.createdAt,
      dateModified: project.updatedAt,
      creator: { '@type': 'Organization', name: seoConfig.siteName, url: base },
      about: project.clientLabel
        ? { '@type': 'Organization', name: project.clientLabel }
        : undefined,
      keywords: project.services?.length ? project.services.join(', ') : undefined,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${base}/portfolio/${project.slug}` },
    };

    this.removeJsonLd();
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(payload);
    this.document.head.appendChild(script);
  }

  private removeJsonLd(): void {
    this.document.head.querySelector(`#${JSON_LD_ID}`)?.remove();
  }
}

/**
 * Première phrase d'un texte, pour servir de description de partage quand le résumé manque.
 *
 * <p>Tronquée à 155 caractères : au-delà, les moteurs coupent eux-mêmes, et en plein mot.
 */
function firstSentence(text: string | null | undefined): string {
  if (!text) {
    return '';
  }
  const plain = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const sentence = plain.split(/(?<=[.!?])\s/)[0] ?? plain;
  return sentence.length > 155 ? `${sentence.slice(0, 152).trimEnd()}…` : sentence;
}
