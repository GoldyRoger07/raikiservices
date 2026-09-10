import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

/** Écran atteint quand un garde de permission refuse l'accès à une route du back-office. */
@Component({
  selector: 'app-forbidden',
  imports: [RouterLink, ButtonModule],
  template: `
    <div class="panel mx-auto max-w-lg p-10 text-center">
      <i class="pi pi-lock mb-4 text-4xl opacity-40"></i>
      <h1 class="font-heading mb-2 text-xl font-semibold">Accès refusé</h1>
      <p class="font-body mb-6 text-sm opacity-70">
        Votre compte ne dispose pas des permissions nécessaires pour ouvrir cet écran.
        Demandez à un administrateur de vous attribuer le rôle correspondant.
      </p>
      <a routerLink="/admin">
        <p-button label="Retour au tableau de bord" icon="pi pi-home" severity="secondary" />
      </a>
    </div>
  `,
})
export default class Forbidden {}
