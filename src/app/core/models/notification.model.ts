/** Route du back-office concernée par chaque type d'évènement — pour ouvrir le bon écran au clic. */
export const NOTIFICATION_ROUTES: Record<string, string> = {
  NEW_CONTACT: '/admin/contact',
  BLOG_PUBLISHED: '/admin/blog',
  NEW_USER_REGISTERED: '/admin/users',
};

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  entityId: number | null;
  /** État lu pour le destinataire qui consulte, pas pour tous. */
  read: boolean;
  createdAt: string;
}

/** Évènement poussé sur le flux SSE `/api/v1/notifications/stream`. */
export interface SseEvent {
  type: string;
  title: string;
  message: string;
  entityId: number | null;
}

/** Interrupteur global d'un type d'évènement (`NotificationSettingResponse`). */
export interface NotificationSetting {
  eventType: string;
  label: string;
  enabled: boolean;
}

/** Préférences de canal du compte connecté (`NotificationPreferenceResponse`). */
export interface NotificationPreference {
  eventType: string;
  label: string;
  inApp: boolean;
  email: boolean;
  push: boolean;
}
