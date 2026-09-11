import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Project } from '../../core/models/project.model';
import {
  CLOUDINARY_CARD_SIZES,
  cloudinarySrcset,
  cloudinaryUrl,
} from '../../core/utils/cloudinary';

/**
 * Carte d'une réalisation : visuel, titre, lien vers le site livré.
 *
 * <p>Extraite de l'accueil et du portfolio, qui en portaient jusqu'ici deux copies
 * identiques au caractère près. Un seul exemplaire évite qu'elles divergent alors qu'elles
 * montrent la même chose.
 *
 * <p>Le visuel part en `srcset` : le navigateur choisit la largeur qui correspond à la
 * place dont il dispose, et un téléphone ne télécharge pas l'image de 1600 pixels.
 *
 * <p>Le visuel et le titre mènent à la page de la réalisation, le lien de droite au site
 * livré. L'agrandissement de l'image qu'offrait la carte a disparu avec l'arrivée de cette
 * page : deux actions concurrentes sur la même vignette rendaient le clic ambigu, et le
 * détail montre de toute façon la même image en grand.
 */
@Component({
  selector: 'project-card',
  imports: [RouterLink],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  protected readonly sizes = CLOUDINARY_CARD_SIZES;

  /** Version affichée dans la grille. */
  protected readonly thumbnail = computed(() => cloudinaryUrl(this.project().coverPublicId, 800));

  protected readonly srcset = computed(() => cloudinarySrcset(this.project().coverPublicId));

  /**
   * Texte alternatif : ce que l'image montre, pas son nom de fichier. Le titre seul dirait
   * « Michael's » sans préciser qu'il s'agit d'un aperçu de site.
   */
  protected readonly alt = computed(() => `Aperçu du site réalisé pour ${this.project().title}`);
}
