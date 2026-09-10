export interface Permission {
  id: number;
  name: string;
  module: string | null;
  action: string | null;
  description: string | null;
  /** Permission seedée au démarrage : ni renommable, ni supprimable. */
  system: boolean;
  createdAt: string;
}

export interface PermissionRequest {
  /** Convention `ACTION_RESSOURCE`, en majuscules (ex. `READ_BLOG`). */
  name: string;
  module?: string | null;
  action?: string | null;
  description?: string | null;
}
