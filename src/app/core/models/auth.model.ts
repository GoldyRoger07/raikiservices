/** Profil de l'utilisateur connecté (`UserSummaryResponse`). */
export interface UserSummary {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  photoUrl: string | null;
  /** Noms de rôles, sans préfixe `ROLE_`. */
  roles: string[];
  /** Permissions effectives, union de celles de tous les rôles. */
  permissions: string[];
}

/**
 * Réponse de connexion et de rafraîchissement.
 *
 * Le refresh token n'y figure pas : il vit dans un cookie HttpOnly déposé par le backend,
 * limité au chemin `/api/v1/auth`.
 */
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  /** Durée de validité de l'access token, en secondes. */
  expiresIn: number;
  user: UserSummary;
}

export interface LoginRequest {
  /** Email ou nom d'utilisateur. */
  login: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
