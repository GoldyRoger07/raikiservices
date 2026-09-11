import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Page de développement : rendu client uniquement, exclue de l'indexation.
  {
    path: 'sandbox',
    renderMode: RenderMode.Client,
  },
  // Back-office et parcours d'authentification : rendu client.
  // Leur contenu dépend de la session du visiteur — il n'y a rien à pré-rendre, et rien
  // à faire indexer. Le pré-rendu échouerait d'ailleurs sur `reset-password`, dont le
  // paramètre `token` n'est connu qu'au clic sur le lien reçu par email.
  {
    path: 'admin',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'forgot-password',
    renderMode: RenderMode.Client,
  },
  {
    path: 'reset-password',
    renderMode: RenderMode.Client,
  },
  // Blog : rendu à la demande sur le serveur (SSR), pas au build.
  // Le pré-rendu figerait la liste et les articles dans le bundle : publier depuis le
  // back-office ne changerait rien avant le déploiement suivant, et le build échouerait dès
  // que le backend n'est pas joignable. Le SSR donne malgré tout du HTML complet aux moteurs
  // de recherche, contenu inclus, puisque Angular attend la fin des appels HTTP avant de
  // rendre la réponse.
  {
    path: 'blog',
    renderMode: RenderMode.Server,
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Server,
  },
  // Réalisations : rendu à la demande, pour les mêmes raisons que le blog.
  // Le pré-rendu figerait la vitrine dans le bundle — publier un projet depuis le
  // back-office ne changerait rien avant le déploiement suivant — et ferait dépendre le
  // build de la disponibilité du backend.
  //
  // L'accueil en fait partie : sa section « Nos Projets » se nourrit de la même source.
  // C'est la page la plus visitée du site, et elle quitte ici le HTML statique qui ne
  // pouvait pas échouer ; `Home.loadFeaturedProjects` encaisse donc l'erreur en silence et
  // masque la section plutôt que de laisser la page se casser. Les autres pages vitrine,
  // dont le contenu ne bouge qu'au déploiement, restent pré-rendues via le `**` ci-dessous.
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'portfolio',
    renderMode: RenderMode.Server,
  },
  {
    path: 'portfolio/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'etudes-de-cas',
    renderMode: RenderMode.Server,
  },
  // Tarifs : le compteur de l'offre de lancement vit en base et se règle depuis le
  // back-office. Pré-rendre la page figerait « il reste 10 places » jusqu'au déploiement
  // suivant, et laisserait une offre épuisée s'afficher encore.
  {
    path: 'tarifs',
    renderMode: RenderMode.Server,
  },
  // Toutes les pages vitrine sont pré-rendues en HTML statique au build (SSG)
  // pour un SEO optimal. Le contenu est présent dès la première réponse ;
  // l'app s'hydrate ensuite côté client.
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
