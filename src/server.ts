import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Aucune route Angular ne reconnaît l'URL : on sert la page 404 pré-rendue avec un vrai
 * statut HTTP 404. Sans ce dernier maillon, Express répondrait son « Cannot GET /… » brut.
 *
 * Le statut compte autant que la page : une 404 renvoyée en 200 (« soft 404 ») fait indexer
 * des pages vides par les moteurs. On garde donc le code d'erreur et on ne remplace que le
 * corps de la réponse.
 */
app.use((req, res) => {
  res.status(404).sendFile(join(browserDistFolder, '404', 'index.html'), (error) => {
    if (error && !res.headersSent) {
      res.status(404).type('text/plain').send('404 - Page introuvable');
    }
  });
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
