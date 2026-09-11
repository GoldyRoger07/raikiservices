/**
 * État de l'offre de lancement, tenu en base et réglable depuis le back-office.
 *
 * <p>Seul `running` intéresse la page publique : il vaut vrai quand l'offre est active
 * *et* qu'il reste des places. Les compteurs servent à l'écran de réglage et à la mention
 * « il reste N places ».
 */
export interface LaunchOfferState {
  running: boolean;
  active: boolean;
  totalSlots: number;
  claimedSlots: number;
  remainingSlots: number;
}

/** Réglage envoyé depuis le back-office. */
export interface LaunchOfferRequest {
  active: boolean;
  totalSlots: number;
  claimedSlots: number;
}
