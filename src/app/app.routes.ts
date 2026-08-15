import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: ()=> import('./pages/home/home')},
    { path: 'sites-web', loadComponent: ()=> import('./pages/services/websites/websites')},
    { path: 'etudes-de-cas',  loadComponent: ()=> import('./pages/projects/case-studies/case-studies') },
    { path: 'portfolio',  loadComponent: ()=> import('./pages/projects/portfolio/portfolio') },
    { path: 'tarifs', loadComponent: ()=> import('./pages/pricing/pricing')},
    { path: 'a-propos', loadComponent: ()=> import('./pages/about-us/about-us')},
    { path: 'seo', loadComponent: ()=> import('./pages/services/seo/seo')},
    { path: 'sandbox', loadComponent: ()=> import('./pages/sandbox/sandbox') },
    { path: 'contact', loadComponent: ()=> import('./pages/contact/contact')}
];
