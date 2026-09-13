import { environment } from '../../../environments/environment';

/**
 * Composition des adresses d'images ImageKit.
 *
 * <p>Point de passage unique et volontairement fermé : c'est ici que se joue la facture.
 * Chaque combinaison distincte de transformations est une variante dérivée, calculée une
 * fois puis servie par le CDN. Laisser le code réclamer des largeurs libres les
 * multiplierait sans fin — d'où le jeu figé de {@link IMAGEKIT_WIDTHS}, à compléter ici et
 * nulle part ailleurs.
 *
 * <p>À doubler, côté compte ImageKit, de la signature d'URL (« Restrict unsigned image
 * URLs » dans les réglages de l'endpoint) : ImageKit refuse alors les transformations
 * forgées à la main, et personne ne peut épuiser les crédits en variant les largeurs dans
 * la barre d'adresse.
 */

/** Largeurs autorisées, en pixels. Toute autre valeur est ramenée à la plus proche. */
export const IMAGEKIT_WIDTHS = [400, 800, 1600] as const;

export type ImageKitWidth = (typeof IMAGEKIT_WIDTHS)[number];

/**
 * Transformations appliquées à toutes les images.
 *
 * <p>`f-auto` livre du WebP ou de l'AVIF selon le navigateur, et `c-at_max` interdit
 * l'agrandissement, qui coûterait des pixels sans rien ajouter.
 *
 * <p>La qualité n'est délibérément pas fixée ici : sans paramètre `q`, ImageKit applique
 * son optimisation automatique, réglable une fois pour toutes dans la console. C'est
 * l'équivalent du `q_auto` de Cloudinary — ImageKit, lui, n'accepte qu'un entier sur `q`,
 * qui figerait la compression au lieu de l'adapter à chaque image.
 */
const BASE_TRANSFORM = 'f-auto,c-at_max';

/**
 * Indication de taille pour l'attribut `sizes` des grilles de cartes : pleine largeur sur
 * mobile, deux colonnes sur tablette, quatre sur grand écran.
 */
export const IMAGEKIT_CARD_SIZES = '(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw';

/**
 * Une source est-elle une adresse déjà constituée plutôt qu'un chemin ImageKit ?
 *
 * <p>Les images historiques du site vivent dans `public/img/…` et sont référencées par
 * chemin absolu. Les reconnaître permet aux deux de cohabiter le temps que les
 * réalisations soient ressaisies depuis le back-office.
 *
 * <p>Un chemin ImageKit commence lui aussi par une barre oblique — « /raiki/projets/x.jpg ».
 * Ce qui les départage est le préfixe `/img/` des images historiques : tout le reste est
 * considéré comme vivant chez ImageKit.
 */
export function isDirectUrl(source: string): boolean {
  return (
    /^(https?:)?\/\//.test(source) || source.startsWith('data:') || source.startsWith('/img/')
  );
}

/**
 * Adresse d'affichage d'une image.
 *
 * @param source chemin ImageKit (`filePath`), ou chemin local déjà constitué
 * @param width  largeur souhaitée ; ramenée à la valeur autorisée la plus proche
 * @returns une chaîne vide si la source est absente, ou si ImageKit n'est pas configuré —
 *          au composant de prévoir ce cas plutôt que d'afficher une image cassée
 */
export function imagekitUrl(source: string | null | undefined, width?: number): string {
  if (!source) {
    return '';
  }
  if (isDirectUrl(source)) {
    return source;
  }
  if (!environment.imagekitUrlEndpoint) {
    return '';
  }

  const transform = width ? `${BASE_TRANSFORM},w-${nearestWidth(width)}` : BASE_TRANSFORM;
  const filePath = source.replace(/^\/+/, '');

  return `${environment.imagekitUrlEndpoint}/${filePath}?tr=${transform}`;
}

/**
 * Jeu de sources pour l'attribut `srcset`, une par largeur autorisée.
 *
 * <p>Le navigateur choisit selon la densité et la place réellement disponibles : un
 * téléphone ne télécharge pas l'image de 1600 pixels.
 */
export function imagekitSrcset(source: string | null | undefined): string {
  if (!source || isDirectUrl(source) || !environment.imagekitUrlEndpoint) {
    return '';
  }
  return IMAGEKIT_WIDTHS.map((width) => `${imagekitUrl(source, width)} ${width}w`).join(', ');
}

/** Largeur autorisée la plus proche de celle demandée. */
function nearestWidth(width: number): ImageKitWidth {
  return IMAGEKIT_WIDTHS.reduce((closest, candidate) =>
    Math.abs(candidate - width) < Math.abs(closest - width) ? candidate : closest,
  );
}
