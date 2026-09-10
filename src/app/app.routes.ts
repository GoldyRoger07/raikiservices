import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/guards/auth.guard';
import { hasPermission } from './core/guards/permission.guard';

export const routes: Routes = [
  // ──────────────── Site vitrine ────────────────
  { path: '', loadComponent: () => import('./pages/home/home') },
  { path: 'sites-web', loadComponent: () => import('./pages/services/websites/websites') },
  {
    path: 'etudes-de-cas',
    loadComponent: () => import('./pages/projects/case-studies/case-studies'),
  },
  { path: 'portfolio', loadComponent: () => import('./pages/projects/portfolio/portfolio') },
  { path: 'tarifs', loadComponent: () => import('./pages/pricing/pricing') },
  { path: 'a-propos', loadComponent: () => import('./pages/about-us/about-us') },
  { path: 'seo', loadComponent: () => import('./pages/services/seo/seo') },
  { path: 'sandbox', loadComponent: () => import('./pages/sandbox/sandbox') },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact') },

  // ──────────────── Blog ────────────────
  // `:slug` et non `:id` : l'adresse publique d'un article est le slug posé par le backend,
  // et c'est lui que `/public/v1/blog/:slug` attend. Le chemin doit rester stable une fois
  // l'article en ligne, sous peine de casser les liens partagés.
  { path: 'blog', loadComponent: () => import('./pages/blog/blog-list/blog-list') },
  { path: 'blog/:slug', loadComponent: () => import('./pages/blog/blog-article/blog-article') },

  // ──────────────── Pages légales ────────────────
  // Pré-rendues comme le reste du site vitrine : ce sont des pages publiques, que les
  // moteurs doivent pouvoir indexer et que les visiteurs atteignent depuis le pied de page.
  {
    path: 'mentions-legales',
    loadComponent: () => import('./pages/legal/mentions-legales/mentions-legales'),
  },
  {
    path: 'politique-de-confidentialite',
    loadComponent: () =>
      import('./pages/legal/politique-de-confidentialite/politique-de-confidentialite'),
  },
  {
    path: 'politique-de-cookies',
    loadComponent: () => import('./pages/legal/politique-de-cookies/politique-de-cookies'),
  },
  {
    path: 'conditions-generales',
    loadComponent: () => import('./pages/legal/conditions-generales/conditions-generales'),
  },

  // ──────────────── Parcours d'authentification ────────────────
  // Les chemins `reset-password` et `admin/contact/:id` sont repris tels quels dans les
  // emails envoyés par le backend : les renommer casserait les liens déjà partis.
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/login/login'),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password'),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password'),
  },

  // ──────────────── Back-office ────────────────
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/admin/dashboard/dashboard'),
      },
      {
        path: 'contact',
        canActivate: [hasPermission('READ_CONTACT')],
        loadComponent: () => import('./pages/admin/contact-messages/contact-messages'),
      },
      {
        path: 'contact/:id',
        canActivate: [hasPermission('READ_CONTACT')],
        loadComponent: () => import('./pages/admin/contact-detail/contact-detail'),
      },
      {
        path: 'blog',
        canActivate: [hasPermission('READ_BLOG')],
        loadComponent: () => import('./pages/admin/blog/blog'),
      },
      // `nouveau` avant `:id` : sans cet ordre, le chemin de création serait capté par la
      // route de modification et l'éditeur chercherait un article d'identifiant « nouveau ».
      {
        path: 'blog/nouveau',
        canActivate: [hasPermission('CREATE_BLOG')],
        loadComponent: () => import('./pages/admin/blog-editor/blog-editor'),
      },
      {
        path: 'blog/:id',
        canActivate: [hasPermission('UPDATE_BLOG')],
        loadComponent: () => import('./pages/admin/blog-editor/blog-editor'),
      },
      {
        path: 'users',
        canActivate: [hasPermission('READ_USER')],
        loadComponent: () => import('./pages/admin/users/users'),
      },
      {
        path: 'roles',
        canActivate: [hasPermission('READ_ROLE')],
        loadComponent: () => import('./pages/admin/roles/roles'),
      },
      {
        path: 'permissions',
        canActivate: [hasPermission('READ_PERMISSION')],
        loadComponent: () => import('./pages/admin/permissions/permissions'),
      },
      {
        path: 'sessions',
        canActivate: [hasPermission('READ_SESSION')],
        loadComponent: () => import('./pages/admin/sessions/sessions'),
      },
      { path: 'profil', loadComponent: () => import('./pages/admin/profile/profile') },
      {
        path: 'acces-refuse',
        loadComponent: () => import('./pages/admin/forbidden/forbidden'),
      },
      { path: '**', redirectTo: '' },
    ],
  },

  // ──────────────── Page introuvable ────────────────
  // `/404` est une vraie route, pré-rendue comme le reste du site vitrine : `src/server.ts`
  // sert son HTML statique avec un statut 404 pour les URL qu'aucune route ne reconnaît.
  //
  // La route `**` monte le même composant plutôt que de rediriger vers `/404` : une
  // redirection ferait répondre 302 au lieu de 404 (le moteur Angular la traite avant que
  // la requête n'atteigne le repli d'Express), et les moteurs de recherche y verraient une
  // « soft 404 ». En montant le composant sur l'URL demandée, le HTML servi et celui que
  // le routeur reconstitue à l'hydratation coïncident. Elle doit rester en dernier : elle
  // capte tout ce qui n'a pas déjà été apparié.
  { path: '404', loadComponent: () => import('./pages/not-found/not-found') },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found') },
];
