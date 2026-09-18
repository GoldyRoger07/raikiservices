import { Component, computed, input } from '@angular/core';
import { Image } from 'primeng/image';

import { Project } from '../../core/models/project.model';
import {
  IMAGEKIT_CARD_SIZES,
  imagekitSrcset,
  imagekitUrl,
} from '../../core/utils/imagekit';

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
 * <p>Un clic sur le visuel ouvre la couverture en grand, par-dessus la page : il n'y a pas
 * de page de détail par réalisation. Le lien de droite mène au site livré.
 */
@Component({
  selector: 'project-card',
  imports: [Image],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  protected readonly sizes = IMAGEKIT_CARD_SIZES;

  /** Version affichée dans la grille. */
  protected readonly thumbnail = computed(() => imagekitUrl(this.project().coverPublicId, 800));

  /** Version affichée dans l'agrandissement, chargée seulement à l'ouverture. */
  protected readonly fullSize = computed(() => imagekitUrl(this.project().coverPublicId, 1600));

  protected readonly srcset = computed(() => imagekitSrcset(this.project().coverPublicId));

  /**
   * Texte alternatif : ce que l'image montre, pas son nom de fichier. Le titre seul dirait
   * « Michael's » sans préciser qu'il s'agit d'un aperçu de site.
   */
  protected readonly alt = computed(() => `Aperçu du site réalisé pour ${this.project().title}`);
}
