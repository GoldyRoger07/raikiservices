/** Fiche d'une image hébergée chez ImageKit, telle que la tient le backend. */
export interface MediaAsset {
  id: number;
  /** Identifiant interne ImageKit, seule clé acceptée pour supprimer le fichier. */
  fileId: string | null;
  /** Chemin ImageKit, dossier compris — « /raiki/projets/abc123_xY9.jpg ». */
  publicId: string;
  /** Adresse d'origine, sans transformation. Sert de vignette de secours. */
  secureUrl: string;
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  folder: string | null;
  originalFilename: string | null;
  /** Repris tel quel dans l'attribut `alt` des images du site. */
  alt: string | null;
  uploadedById: number | null;
  uploadedByName: string | null;
  uploadedAt: string;
}

/**
 * Autorisation d'envoi délivrée par le backend.
 *
 * <p>Valable pour un seul envoi : ImageKit recalcule l'empreinte sur le couple
 * `token + expire` reçu et rejette un jeton déjà consommé ou périmé.
 */
export interface UploadSignature {
  publicKey: string;
  /** Base de livraison, pour recomposer les adresses — « https://ik.imagekit.io/<id> ». */
  urlEndpoint: string;
  token: string;
  /** Horodatage Unix, en secondes, au-delà duquel l'autorisation est caduque. */
  expire: number;
  signature: string;
  folder: string;
  uploadUrl: string;
  /** Plafond à faire respecter avant l'envoi, pour ne pas gaspiller un aller-retour. */
  maxBytes: number;
}

/**
 * Réponse brute d'ImageKit après téléversement.
 *
 * <p>Champs laissés au nommage de l'API d'ImageKit plutôt que renommés, pour qu'on les
 * reconnaisse dans sa documentation. Noter les deux identifiants : `fileId` sert à
 * supprimer, `filePath` à référencer et à composer les adresses.
 */
export interface ImageKitUploadResult {
  fileId: string;
  /** Nom final du fichier, suffixé d'un jeton unique par ImageKit. */
  name: string;
  filePath: string;
  url: string;
  /** « image » ou « non-image » — une catégorie, pas une extension ni un type MIME. */
  fileType: string;
  height: number;
  width: number;
  /** Poids en octets. */
  size: number;
}

/** Déclaration d'une image téléversée, à envoyer au backend juste après. */
export interface MediaRegisterRequest {
  fileId: string;
  publicId: string;
  secureUrl: string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  folder?: string | null;
  originalFilename?: string | null;
  alt?: string | null;
}

/** Seul champ modifiable d'une image : son texte alternatif. */
export interface MediaUpdateRequest {
  alt: string | null;
}

/**
 * Avancement d'un envoi.
 *
 * <p>Union discriminée plutôt qu'un objet à champs optionnels : l'appelant est obligé de
 * distinguer la progression du résultat, et ne peut pas lire une fiche encore absente.
 */
export type UploadEvent =
  { kind: 'progress'; percent: number } | { kind: 'done'; asset: MediaAsset };
