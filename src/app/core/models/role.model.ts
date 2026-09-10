/** Permission réduite à ce dont le back-office a besoin : l'afficher et la resoumettre. */
export interface PermissionRef {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  /** Rôle système : non renommable, non supprimable, permissions réalignées au démarrage. */
  system: boolean;
  createdAt: string;
  permissions: PermissionRef[];
}

export interface RoleRequest {
  /** Sans préfixe `ROLE_` : le backend l'ajoute à la volée. */
  name: string;
  description?: string | null;
  /** Jeu complet des permissions : la liste envoyée remplace l'existante. */
  permissionIds: number[];
}
