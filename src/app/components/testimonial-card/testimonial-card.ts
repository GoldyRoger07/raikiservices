import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Testimonial } from '../../core/models/testimonial.model';
import { imagekitUrl } from '../../core/utils/imagekit';

/**
 * Carte d'un témoignage : note, citation, auteur, lien vers la réalisation concernée.
 *
 * <p>Partagée par l'accueil, la page des témoignages et le détail d'une réalisation. Le lien
 * vers le projet est ce qui rend l'avis vérifiable : il n'apparaît que si la réalisation est
 * publiée, le backend ne transmettant pas les autres.
 *
 * <p>`showProjectLink` se désactive sur la page d'une réalisation, où le lien ramènerait à
 * la page déjà ouverte.
 */
@Component({
  selector: 'testimonial-card',
  imports: [RouterLink],
  templateUrl: './testimonial-card.html',
  styleUrl: './testimonial-card.css',
})
export class TestimonialCard {
  readonly testimonial = input.required<Testimonial>();
  readonly showProjectLink = input(true);

  protected readonly stars = [1, 2, 3, 4, 5];

  /** 96 pixels affichés au plus : la plus petite variante ImageKit suffit largement. */
  protected readonly photo = computed(() => imagekitUrl(this.testimonial().photoPublicId, 400));

  /** Initiales de repli quand le client n'a pas fourni de photo — « Marie Joseph » → « MJ ». */
  protected readonly initials = computed(() =>
    this.testimonial()
      .authorName.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join(''),
  );

  /** « Gérante, Restaurant Le Michael's », ou l'un des deux s'il manque l'autre. */
  protected readonly byline = computed(() => {
    const { authorRole, company } = this.testimonial();
    return [authorRole, company].filter(Boolean).join(', ');
  });
}
