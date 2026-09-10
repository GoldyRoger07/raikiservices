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
  // Toutes les pages vitrine sont pré-rendues en HTML statique au build (SSG)
  // pour un SEO optimal. Le contenu est présent dès la première réponse ;
  // l'app s'hydrate ensuite côté client.
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
