/** Configuration de développement : backend Spring lancé en local sur le port 8081. */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081',
  /** Même valeur qu'`imagekit.url-endpoint` côté backend. Vide = images désactivées. */
  imagekitUrlEndpoint: '',
};
