import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { AppPreset } from './theme/app-preset';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Le back-office enchaîne les listes : sans cela, on arrive au milieu de la page suivante.
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(),
    // `withFetch` évite le double appel HTTP entre rendu serveur et hydratation.
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          // Le mode sombre s'active via la classe .app-dark sur <html>.
          // Absence de la classe = mode clair (thème par défaut).
          darkModeSelector: '.app-dark',
          // Compatibilité avec Tailwind CSS v4 : styles PrimeNG dans un layer
          // dédié, en dessous des utilitaires Tailwind.
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, utilities',
          },
        },
      },
    }),
  ],
};
