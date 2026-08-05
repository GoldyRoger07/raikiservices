import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: ()=> import('./pages/home/home')},
    { path: 'sites-web', loadComponent: ()=> import('./pages/services/websites/websites')},
    { path: 'contact', loadComponent: ()=> import('./pages/contact/contact')}
];
