export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export const USER_STATUSES: readonly UserStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

/** Libellés français affichés dans le back-office. */
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  SUSPENDED: 'Suspendu',
};

/** Sévérité PrimeNG associée à chaque statut, pour les `p-tag`. */
export const USER_STATUS_SEVERITY: Record<UserStatus, string> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  SUSPENDED: 'danger',
};

export interface RoleRef {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  position: string | null;
  bio: string | null;
  photoUrl: string | null;
  enabled: boolean;
  status: UserStatus;
  createdAt: string;
  roles: RoleRef[];
  /** Permissions effectives, cumulées sur tous les rôles du compte. */
  permissions: string[];
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  position?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  enabled?: boolean;
  status?: UserStatus;
  /** Jeu complet des rôles : la liste envoyée remplace l'existante. */
  roleIds?: number[];
}

/**
 * Modification d'un compte. Le mot de passe laissé vide conserve l'actuel ; le renseigner
 * le remplace et ferme toutes les sessions ouvertes du compte.
 */
export interface UserUpdateRequest extends Omit<UserCreateRequest, 'password'> {
  password?: string | null;
}
