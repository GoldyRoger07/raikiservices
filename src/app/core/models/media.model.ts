/** Fiche d'une image hébergée chez Cloudinary, telle que la tient le backend. */
export interface MediaAsset {
  id: number;
  /** Identifiant Cloudinary, dossier compris — « raiki/projets/abc123 ». */
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
 * <p>Valable pour un seul envoi : Cloudinary recalcule l'empreinte sur ce qu'il reçoit et
 * rejette un horodatage périmé.
 */
export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
  uploadUrl: string;
  /** Plafond à faire respecter avant l'envoi, pour ne pas gaspiller un aller-retour. */
  maxBytes: number;
}

/**
 * Réponse brute de Cloudinary après téléversement.
 *
 * <p>Nommage en `snake_case` : ce sont les champs de l'API de Cloudinary, laissés tels
 * quels plutôt que renommés, pour qu'on les reconnaisse dans sa documentation.
 */
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
}

/** Déclaration d'une image téléversée, à envoyer au backend juste après. */
export interface MediaRegisterRequest {
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
