/** Session active telle qu'affichée dans le back-office (`SessionResponse`). */
export interface Session {
  id: number;
  userId: number;
  username: string;
  userEmail: string;
  userStatus: string | null;
  device: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  /** Vrai pour la session courante : à ne pas proposer à la révocation individuelle. */
  current: boolean;
}
