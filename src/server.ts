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
 * Cache mémoire des pages vitrine rendues à la demande.
 *
 * Ces pages ont quitté le pré-rendu pour que le back-office puisse les mettre à jour sans
 * redéploiement : chaque visite déclenche donc un rendu serveur et un appel au backend.
 * Leur contenu ne change qu'à la publication d'une réalisation — les servir telles quelles
 * pendant une minute épargne au serveur l'essentiel de ce travail, aux heures de pointe
 * comme face à un robot d'indexation.
 *
 * L'en-tête `Cache-Control` ne suffirait pas : il s'adresse au navigateur et aux relais,
 * pas au processus de rendu, et Render n'interpose aucun cache devant l'application.
 *
 * Le cache est volontairement borné aux chemins listés, et aux requêtes sans paramètres :
 * une page dépendant d'une session ou d'une recherche n'a rien à faire dans un cache
 * partagé entre tous les visiteurs.
 */
const CACHED_PATHS = ['/', '/portfolio', '/etudes-de-cas'];
const CACHE_TTL_MS = 60_000;

const htmlCache = new Map<string, { body: Buffer; expiresAt: number }>();

app.get(CACHED_PATHS, (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    next();
    return;
  }

  const cached = htmlCache.get(req.path);
  if (cached && cached.expiresAt > Date.now()) {
    res.setHeader('Content-Type', 'text/html;charset=UTF-8');
    res.setHeader('X-Render-Cache', 'hit');
    res.end(cached.body);
    return;
  }
  res.setHeader('X-Render-Cache', 'miss');

  // On capture le corps au niveau de `write`/`end`, et non de `res.send` : le moteur Angular
  // passe par `writeResponseToNodeResponse`, qui écrit directement dans la réponse Node sans
  // jamais emprunter les méthodes d'Express. Un enrobage de `res.send` ne se déclencherait
  // donc jamais — et laisserait croire à un cache actif.
  const chunks: Buffer[] = [];
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  res.write = function (chunk: unknown, ...rest: unknown[]) {
    collect(chunks, chunk);
    return (originalWrite as (...args: unknown[]) => boolean)(chunk, ...rest);
  } as typeof res.write;

  res.end = function (chunk?: unknown, ...rest: unknown[]) {
    collect(chunks, chunk);
    // Seules les réponses complètes et réussies sont gardées : mettre en cache une page
    // d'erreur la figerait pour une minute sur toutes les visites suivantes.
    if (res.statusCode === 200 && chunks.length > 0) {
      htmlCache.set(req.path, {
        body: Buffer.concat(chunks),
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
    }
    return (originalEnd as (...args: unknown[]) => typeof res)(chunk, ...rest);
  } as typeof res.end;

  next();
});

/**
 * Recopie un morceau de réponse dans le tampon du cache.
 *
 * Le moteur écrit des `Uint8Array` — ce que produit un flux web — et non des `Buffer` :
 * un test sur `instanceof Buffer` laisserait passer tout le corps de la page et le cache
 * n'enregistrerait jamais rien.
 */
function collect(chunks: Buffer[], chunk: unknown): void {
  if (typeof chunk === 'string') {
    chunks.push(Buffer.from(chunk, 'utf8'));
  } else if (ArrayBuffer.isView(chunk)) {
    chunks.push(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength));
  }
}

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
