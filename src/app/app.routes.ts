import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: ()=> import('./pages/home/home')},
    { path: 'contact', loadComponent: ()=> import('./pages/contact/contact')}
];
