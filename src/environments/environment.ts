/**
 * Configuration de production.
 *
 * `apiUrl` est la racine du backend Spring (sans slash final) : les services y ajoutent
 * eux-mêmes `/api/v1/...` ou `/public/v1/...`. Mettre à jour lors d'un changement de domaine
 * d'API — et penser à ajouter l'origine du site à `app.cors.allowed-origins` côté backend.
 *
 * `cloudinaryCloudName` est le nom de compte Cloudinary, une donnée publique qui figure
 * dans chaque adresse d'image. Il doit valoir `cloudinary.cloud-name` côté backend, sans
 * quoi les images des réalisations ne s'afficheront pas. Laissé vide, `cloudinaryUrl()`
 * renvoie une chaîne vide plutôt qu'une adresse cassée.
 */
export const environment = {
  production: true,
  apiUrl: 'https://api.raikiservices.com',
  cloudinaryCloudName: '',
};
