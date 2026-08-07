import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: ()=> import('./pages/home/home')},
    { path: 'sites-web', loadComponent: ()=> import('./pages/services/websites/websites')},
    { path: 'seo', loadComponent: ()=> import('./pages/services/seo/seo')},
    { path: 'contact', loadComponent: ()=> import('./pages/contact/contact')}
];
