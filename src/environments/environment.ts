/**
 * Configuration de production.
 *
 * `apiUrl` est la racine du backend Spring (sans slash final) : les services y ajoutent
 * eux-mêmes `/api/v1/...` ou `/public/v1/...`. Mettre à jour lors d'un changement de domaine
 * d'API — et penser à ajouter l'origine du site à `app.cors.allowed-origins` côté backend.
 */
export const environment = {
  production: true,
  apiUrl: 'https://api.raikiservices.com',
};
