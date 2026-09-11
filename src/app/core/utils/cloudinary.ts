import { environment } from '../../../environments/environment';

/**
 * Composition des adresses d'images Cloudinary.
 *
 * <p>Point de passage unique et volontairement fermé : c'est ici que se joue la facture.
 * Chaque combinaison distincte de transformations est une variante dérivée, facturée une
 * fois puis servie par le CDN. Laisser le code réclamer des largeurs libres les
 * multiplierait sans fin — d'où le jeu figé de {@link CLOUDINARY_WIDTHS}, à compléter ici
 * et nulle part ailleurs.
 *
 * <p>À doubler, côté compte Cloudinary, de l'option « strict transformations » : Cloudinary
 * refuse alors toute transformation non déclarée, et personne ne peut épuiser les crédits
 * en forgeant des adresses à la main.
 */

/** Largeurs autorisées, en pixels. Toute autre valeur est ramenée à la plus proche. */
export const CLOUDINARY_WIDTHS = [400, 800, 1600] as const;

export type CloudinaryWidth = (typeof CLOUDINARY_WIDTHS)[number];

/**
 * Transformations appliquées à toutes les images.
 *
 * <p>`f_auto` livre du WebP ou de l'AVIF selon le navigateur et `q_auto` ajuste la
 * compression : à l'œil le rendu est identique, pour une fraction du poids — donc de la
 * bande passante facturée. `c_limit` interdit l'agrandissement, qui coûterait des pixels
 * sans rien ajouter.
 */
const BASE_TRANSFORM = 'f_auto,q_auto,c_limit';

/**
 * Indication de taille pour l'attribut `sizes` des grilles de cartes : pleine largeur sur
 * mobile, deux colonnes sur tablette, quatre sur grand écran.
 */
export const CLOUDINARY_CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw';

/**
 * Une source est-elle une adresse déjà constituée plutôt qu'un identifiant Cloudinary ?
 *
 * <p>Les images historiques du site vivent dans `public/img/…` et sont référencées par
 * chemin absolu. Les reconnaître permet aux deux de cohabiter le temps que les
 * réalisations soient ressaisies depuis le back-office.
 */
export function isDirectUrl(source: string): boolean {
  return /^(https?:)?\/\//.test(source) || source.startsWith('/') || source.startsWith('data:');
}

/**
 * Adresse d'affichage d'une image.
 *
 * @param source identifiant Cloudinary, ou chemin local déjà constitué
 * @param width  largeur souhaitée ; ramenée à la valeur autorisée la plus proche
 * @returns une chaîne vide si la source est absente, ou si Cloudinary n'est pas configuré —
 *          au composant de prévoir ce cas plutôt que d'afficher une image cassée
 */
export function cloudinaryUrl(source: string | null | undefined, width?: number): string {
  if (!source) {
    return '';
  }
  if (isDirectUrl(source)) {
    return source;
  }
  if (!environment.cloudinaryCloudName) {
    return '';
  }

  const transform = width ? `${BASE_TRANSFORM},w_${nearestWidth(width)}` : BASE_TRANSFORM;
  const publicId = source.replace(/^\/+/, '');

  return `https://res.cloudinary.com/${environment.cloudinaryCloudName}/image/upload/${transform}/${publicId}`;
}

/**
 * Jeu de sources pour l'attribut `srcset`, une par largeur autorisée.
 *
 * <p>Le navigateur choisit selon la densité et la place réellement disponibles : un
 * téléphone ne télécharge pas l'image de 1600 pixels.
 */
export function cloudinarySrcset(source: string | null | undefined): string {
  if (!source || isDirectUrl(source) || !environment.cloudinaryCloudName) {
    return '';
  }
  return CLOUDINARY_WIDTHS.map((width) => `${cloudinaryUrl(source, width)} ${width}w`).join(', ');
}

/** Largeur autorisée la plus proche de celle demandée. */
function nearestWidth(width: number): CloudinaryWidth {
  return CLOUDINARY_WIDTHS.reduce((closest, candidate) =>
    Math.abs(candidate - width) < Math.abs(closest - width) ? candidate : closest,
  );
}
