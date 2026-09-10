/** Cycle de vie d'un message déposé depuis le formulaire public. */
export type ContactStatus = 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'WON' | 'LOST';

export const CONTACT_STATUSES: readonly ContactStatus[] = [
  'NEW',
  'IN_PROGRESS',
  'CONTACTED',
  'WON',
  'LOST',
];

/** Libellés français affichés dans le back-office. */
export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  NEW: 'Nouveau',
  IN_PROGRESS: 'En cours',
  CONTACTED: 'Contacté',
  WON: 'Gagné',
  LOST: 'Perdu',
};

/** Sévérité PrimeNG associée à chaque statut, pour les `p-tag`. */
export const CONTACT_STATUS_SEVERITY: Record<ContactStatus, string> = {
  NEW: 'info',
  IN_PROGRESS: 'warn',
  CONTACTED: 'secondary',
  WON: 'success',
  LOST: 'danger',
};

export interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  companyName: string | null;
  serviceCategory: string | null;
  subject: string | null;
  /** Tronqué à 160 caractères dans les listes ; complet sur le détail. */
  message: string;
  newsletterOptIn: boolean;
  status: ContactStatus;
  adminNotes: string | null;
  submittedAt: string;
}

/** Charge utile du formulaire public. Aucun champ de suivi n'y est accepté. */
export interface ContactMessageRequest {
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  serviceCategory?: string | null;
  subject?: string | null;
  message: string;
  newsletterOptIn?: boolean;
}

/** Seuls champs modifiables depuis le back-office : le message reste immuable. */
export interface ContactMessageUpdateRequest {
  status: ContactStatus;
  adminNotes?: string | null;
}
