import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Page de développement : rendu client uniquement, exclue de l'indexation.
  {
    path: 'sandbox',
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
