import { IMAGEKIT_WIDTHS } from './imagekit';

/**
 * Préparation des images avant envoi.
 *
 * <p>C'est ici que se joue l'essentiel de l'économie : une photo d'appareil ou une capture
 * d'écran en pleine résolution pèse plusieurs mégaoctets pour être affichée dans une carte
 * de 400 pixels de large. La réduire dans le navigateur allège d'un coup le transfert, le
 * stockage facturé chez ImageKit et l'attente de celui qui téléverse — sans rien changer
 * à ce que verra le visiteur.
 *
 * <p>Le code touche au `document` et au `canvas` : il ne s'exécute qu'en réponse à une
 * action de l'utilisateur, dans le back-office, qui est rendu côté client uniquement.
 */

/** Largeur maximale conservée : la plus grande que le site sache livrer. */
const MAX_WIDTH = Math.max(...IMAGEKIT_WIDTHS);

/** Compromis poids/qualité du WebP produit. Au-delà, le gain de poids devient marginal. */
const WEBP_QUALITY = 0.9;

/** Types acceptés à l'envoi. Le SVG est exclu : il peut embarquer du script. */
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export const ACCEPTED_IMAGE_TYPES = ACCEPTED.join(',');

/**
 * Réduit une image à la largeur maximale utile et la réencode en WebP.
 *
 * <p>Le fichier d'origine est conservé dans deux cas : s'il est déjà plus étroit que la
 * largeur maximale — le réencoder ne ferait que le dégrader —, et si la conversion donne
 * un résultat plus lourd que l'original, ce qui arrive sur les aplats et les captures déjà
 * bien compressées. L'animation d'un GIF ne survivrait pas au passage par le canevas : ces
 * fichiers repartent donc intacts.
 *
 * @throws Error si le fichier n'est pas une image d'un type accepté
 */
export async function prepareImage(file: File): Promise<File> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error(`« ${file.name} » n'est pas une image acceptée (JPEG, PNG, WebP, AVIF, GIF).`);
  }
  if (file.type === 'image/gif') {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width <= MAX_WIDTH) {
      return file;
    }

    const height = Math.round((bitmap.height * MAX_WIDTH) / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = MAX_WIDTH;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }
    context.drawImage(bitmap, 0, 0, MAX_WIDTH, height);

    const blob = await toBlob(canvas);
    if (!blob || blob.size >= file.size) {
      return file;
    }
    return new File([blob], renameToWebp(file.name), { type: 'image/webp' });
  } finally {
    // Le bitmap décodé occupe la mémoire tant qu'on ne le libère pas — et un envoi groupé
    // en crée autant qu'il y a de fichiers.
    bitmap.close();
  }
}

/** Poids lisible : « 248 Ko », « 1,4 Mo ». */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) {
    return '—';
  }
  if (bytes < 1024) {
    return `${bytes} o`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`;
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY));
}

function renameToWebp(filename: string): string {
  return filename.replace(/\.[^.]+$/, '') + '.webp';
}
