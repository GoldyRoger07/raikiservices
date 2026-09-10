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
  // Toutes les pages vitrine sont pré-rendues en HTML statique au build (SSG)
  // pour un SEO optimal. Le contenu est présent dès la première réponse ;
  // l'app s'hydrate ensuite côté client.
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
