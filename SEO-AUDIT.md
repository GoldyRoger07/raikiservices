
# Audit SEO technique — RaikiServices (raikiservices-ssr)

> Audit réalisé le 2026-09-02 · Angular 21 SSR + Express · déploiement Render.com
> Stratégie de rendu retenue : **Hybride** (Prerender/SSG pour les pages vitrine + SSR ciblé si besoin plus tard).
> Ce document est un **audit** — aucune modification de code source n'a été faite.

---

## 1. Résumé exécutif

Le projet a **toute l'infrastructure SSR en place mais ne l'utilise pas** : toutes les routes sont forcées en `RenderMode.Client`. Résultat : Googlebot et les réseaux sociaux reçoivent une coquille HTML vide (`<title>RaikiservicesSsr</title>`, pas de description, pas de contenu pré-rendu). **Tout le bénéfice SEO du SSR est actuellement neutralisé.**

La bonne nouvelle : le code est prêt pour le prerender. Tous les accès navigateur (`window`, `IntersectionObserver`, `localStorage`, scroll) sont correctement gardés par `isPlatformBrowser`. La bascule vers un rendu hybride est donc réalisable **sans refactor lourd**.

**Note SEO technique globale : ~2/10** (uniquement à cause du rendu + absence totale de métadonnées ; la base technique est saine).

### Top 5 des actions à impact maximal
| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Passer les routes publiques de `Client` → `Prerender` | Moyen | 🔴 Critique |
| 2 | `SeoService` + titres/descriptions uniques par page | Moyen | 🔴 Critique |
| 3 | `robots.txt` + `sitemap.xml` | Faible | 🔴 Critique |
| 4 | Corriger `index.html` (`lang`, title, OG, canonical) | Faible | 🟠 Élevé |
| 5 | JSON-LD `Organization`/`LocalBusiness` + `WebSite` | Faible | 🟠 Élevé |

---

## 2. Problèmes critiques 🔴

### 2.1 — Rendu client forcé sur toutes les routes
**Fichier :** `src/app/app.routes.server.ts:6`
```ts
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Client }  // ← tout le site en CSR
];
```
Le serveur envoie une page vide, le contenu n'apparaît qu'après exécution du JS côté client. Googlebot peut exécuter le JS, mais avec un budget de crawl limité et un retard d'indexation ; les autres bots (Bing, réseaux sociaux, aperçus de liens) ne voient **rien**.

**Recommandation (hybride) :** prérendre toutes les pages vitrine, exclure `sandbox` de l'indexation.

| Route | Rendu recommandé | Raison |
|-------|------------------|--------|
| `''` (accueil) | `Prerender` | Statique |
| `sites-web` | `Prerender` | Statique |
| `seo` | `Prerender` | Statique |
| `tarifs` | `Prerender` | Statique |
| `etudes-de-cas` | `Prerender` | Statique |
| `portfolio` | `Prerender` | Statique |
| `a-propos` | `Prerender` | Statique |
| `contact` | `Prerender` | Statique (formulaire hydraté côté client) |
| `sandbox` | `Client` + `noindex` | Page de dev, ne doit pas être indexée |

Forme cible :
```ts
export const serverRoutes: ServerRoute[] = [
  { path: 'sandbox', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender },
];
```
> ⚠️ À valider au build : les Web Components tiers (`@omnedia/ngx-particles`, `ngx-typewriter`, `swiper-element`) ne doivent pas casser le prerender. Ils sont déjà en `CUSTOM_ELEMENTS_SCHEMA` et gardés ; un `npm run build` de contrôle confirmera. Plan B si l'un pose problème : le garder en `Client` route par route.

### 2.2 — `index.html` non optimisé
**Fichier :** `src/index.html`
- `lang="en"` (ligne 2) alors que le contenu est **en français** → mauvais signal de langue à Google. Doit être `lang="fr"`.
- `<title>RaikiservicesSsr</title>` (ligne 5) → placeholder de scaffolding.
- **Aucune** `<meta name="description">`, `theme-color`, `og:*`, `twitter:*`, canonical.
- `<script src="https://cdn.jsdelivr.net/npm/swiper@14...">` (ligne 12) : script tiers **bloquant** chargé sur toutes les pages → nuit au LCP (Core Web Vitals) et dépendance CDN externe. À charger en `defer`, ou en local, ou uniquement sur les pages qui utilisent le slider.

### 2.3 — Zéro métadonnée par page
Aucun composant n'utilise `Title` / `Meta` d'Angular. Les 9 pages partagent donc le même `<title>` vide. Chaque page doit avoir un titre + une description uniques (voir §3.3 pour une proposition de contenu prêt à l'emploi).

### 2.4 — Pas de `robots.txt` ni `sitemap.xml`
`public/` ne contient ni `robots.txt` ni `sitemap.xml`. Les moteurs n'ont aucune carte du site ni directive de crawl. (Contenu proposé en §3.5 et §3.6.)

---

## 3. Détail par catégorie

### 3.1 — Configuration entreprise incomplète
**Fichier :** `src/app/config/brand/company.ts` — plusieurs champs vides, or c'est la **source unique** pour les meta et le JSON-LD :
```ts
description: "",              // ← vide
contact: { email: "", phone: "", address: "" }  // ← vides
logo: { dark: "" }           // ← vide
```
Ces données sont **nécessaires** pour : meta description de secours, JSON-LD `Organization`/`LocalBusiness`, données de contact structurées.

### 3.2 — ⚠️ Réseaux sociaux d'un autre projet
**Fichier :** `src/app/config/brand/social.ts` — les 3 URLs pointent vers **« secogroupe »**, pas RaikiServices :
```
https://facebook.com/secogroupe
https://instagram.com/secogroupe
https://linkedin.com/company/secogroupe
```
Ces liens alimentent le footer **et** le champ `sameAs` du JSON-LD → tu enverrais à Google des signaux d'identité pointant vers la mauvaise entité. **À corriger avant toute mise en ligne du SEO.**

### 3.3 — Titres & meta descriptions proposés (prêts à l'emploi)
Basés sur le contenu réel des pages. Titres ≤ 60 caractères, descriptions ≤ 155.

| Route | `<title>` | `<meta description>` |
|-------|-----------|----------------------|
| `''` | Création de site web & SEO \| RaikiServices | Agence web : sites modernes, rapides et optimisés SEO pour rendre votre entreprise visible et attirer plus de clients. Demandez un devis. |
| `sites-web` | Création de sites web sur mesure \| RaikiServices | Des sites web personnalisés, rapides et responsives, conçus autour de votre entreprise pour convertir vos visiteurs en clients. |
| `seo` | Référencement SEO Google \| RaikiServices | Améliorez votre classement sur Google et générez un trafic organique qualifié grâce à notre expertise en SEO technique et de contenu. |
| `tarifs` | Tarifs création de site web \| RaikiServices | Des offres claires et transparentes pour la création de votre site web et votre référencement. Découvrez nos formules. |
| `etudes-de-cas` | Études de cas clients \| RaikiServices | Résultats concrets de projets web et SEO réalisés pour de vrais clients. Découvrez notre approche et nos performances. |
| `portfolio` | Portfolio & réalisations \| RaikiServices | Découvrez notre galerie de créations de sites web modernes réalisés pour nos clients. |
| `a-propos` | À propos de RaikiServices \| Agence web | Une agence web qui conçoit des sites sur mesure, pensés pour vos clients et construits pour durer. Découvrez notre approche. |
| `contact` | Contact & devis \| RaikiServices | Contactez RaikiServices pour votre projet de site web ou de référencement. Demandez un devis gratuit et sans engagement. |

> `sandbox` : pas de meta publique, ajouter `<meta name="robots" content="noindex">`.

### 3.4 — Open Graph, Twitter Cards, canonical, hreflang
À gérer via le futur `SeoService`, par page :
- **Open Graph :** `og:title`, `og:description`, `og:type` (`website`), `og:url` (canonique), `og:image`, `og:locale` (`fr_FR`), `og:site_name`.
- **Twitter :** `twitter:card` (`summary_large_image`), `twitter:title/description/image`.
- **Canonical :** `<link rel="canonical">` par page (évite le duplicate content, notamment `www` vs non-`www` et avec/sans slash).
- **Image OG :** ⚠️ inexistante. Seul `public/img/logo.png` est présent. Créer une image de partage **1200×630 px** (`public/img/og/og-default.png`) — un logo simple ne rend pas bien en aperçu de lien.
- **hreflang :** un contenu `en.ts` existe mais la langue est **hardcodée `fr`** (`LanguageService`). Tant que l'anglais n'est pas routé (ex. `/en/...`), **ne pas** ajouter de `hreflang` — ce serait un signal erroné. À prévoir seulement si tu actives réellement le multilingue.

### 3.5 — `robots.txt` proposé
À créer dans `public/robots.txt` (servi tel quel, cache 1 an OK) :
```
User-agent: *
Allow: /
Disallow: /sandbox

Sitemap: https://raikiservices.com/sitemap.xml
```

### 3.6 — `sitemap.xml`
Deux options :
1. **Statique** dans `public/sitemap.xml` — simple, suffisant pour 8 pages fixes. À mettre à jour à la main quand une route s'ajoute.
2. **Dynamique** via un endpoint Express dans `src/server.ts` (`app.get('/sitemap.xml', ...)`, **avant** le catch-all Angular) qui génère le XML depuis la liste des routes → jamais désynchronisé.

> Recommandation : commencer statique (rapide), passer dynamique plus tard si les routes bougent souvent. Domaine à utiliser : `https://raikiservices.com` (cohérent avec `render.yaml`). Choisir **une** version canonique `www` ou non-`www` et rediriger l'autre (301) au niveau Express/Render.

### 3.7 — Données structurées (JSON-LD)
Aucune actuellement. À injecter (idéalement pré-rendu, dans le `<head>` ou en fin de `<body>`) :
- **`Organization`** (ou **`LocalBusiness`** / `ProfessionalService` si adresse physique) — global : `name`, `url`, `logo`, `description`, `sameAs` (réseaux **corrigés**), `contactPoint`.
- **`WebSite`** — global : `name`, `url` (permet le sitelinks searchbox si recherche interne un jour).
- **`BreadcrumbList`** — par page interne (fil d'Ariane) → rich results.
- **`Service`** — sur `/sites-web` et `/seo` (type de prestation, zone desservie).
- **`FAQPage`** — si les composants FAQ (`components/faqs/`) contiennent des Q/R, les baliser → éligibilité aux rich results FAQ.

À valider ensuite avec le [Rich Results Test](https://search.google.com/test/rich-results) de Google.

### 3.8 — Performance / Core Web Vitals
- **Swiper CDN bloquant** (`index.html:12`) → `defer` au minimum, idéalement chargé à la demande. Impacte le LCP.
- **Images** : vérifier `width`/`height` explicites (évite le CLS) et privilégier des formats modernes (WebP/AVIF) + `loading="lazy"` sur les images hors écran. `hero-raiki.png` (image LCP probable) doit être `loading="eager"` / `fetchpriority="high"` et bien dimensionnée.
- **Polices** : `public/fonts` — s'assurer d'un `font-display: swap` et d'un `preload` sur la police critique.
- **`optimization`** : OK — désactivée uniquement en `development`, la prod l'active par défaut.
- Mesurer un **Lighthouse** de référence une fois le prerender en place.

### 3.9 — Sémantique & accessibilité (signaux SEO secondaires)
À vérifier lors de l'implémentation : un seul `<h1>` par page, hiérarchie `h1→h2→h3` cohérente, `alt` descriptifs sur les images, liens `<a>` (pas de `<div>` cliquables) pour que Google suive le maillage interne. Le maillage interne (header/footer) est déjà bon via `RouterLink`.

---

## 4. Plan d'implémentation proposé (par phases)

**Phase 1 — Fondations d'indexabilité (débloque le SEO)**
1. `app.routes.server.ts` → Prerender (hybride, sandbox exclu).
2. `index.html` → `lang="fr"`, title réel, meta description, theme-color, OG/Twitter par défaut, canonical, swiper en `defer`.
3. Build de contrôle (`npm run build`) pour valider le prerender des Web Components.

**Phase 2 — Métadonnées dynamiques**
4. `SeoService` (wrapper `Title` + `Meta`, gère OG/Twitter/canonical).
5. Appliquer les titres/descriptions de §3.3 sur chaque page (via données de route ou dans chaque composant `ngOnInit`).
6. `noindex` sur `sandbox`.

**Phase 3 — Crawl & rich results**
7. `robots.txt` + `sitemap.xml` (statique pour commencer).
8. Compléter `company.ts` + corriger `social.ts`.
9. JSON-LD `Organization`/`WebSite` (global) + `BreadcrumbList` (par page) + `Service`/`FAQPage`.
10. Image OG 1200×630.

**Phase 4 — Perf & finitions**
11. Audit Lighthouse, optimisation images/polices, CLS/LCP.
12. Redirection canonique `www`/non-`www` + HTTPS au niveau Express/Render.

**Phase 5 — Hors-code (à faire par toi)**
13. Google Search Console (vérification propriété + soumission sitemap).
14. Google Business Profile (fiche établissement — fort levier local).
15. Bing Webmaster Tools.

---

## 5. Ce dont j'ai besoin de toi pour l'implémentation

Pour remplir `company.ts` et le JSON-LD sans placeholders :
1. **Domaine canonique** définitif : `raikiservices.com` ou `www.raikiservices.com` ?
2. **Description officielle** de l'agence (1–2 phrases).
3. **Contact** : e-mail pro, téléphone, adresse (ou zone géographique desservie si pas de local).
4. **Réseaux sociaux réels** de RaikiServices (pour remplacer les liens « secogroupe »).
5. **Type d'activité** pour le JSON-LD : `Organization` simple, ou `LocalBusiness`/`ProfessionalService` avec adresse ?
6. As-tu déjà un compte **Google Search Console** / **Google Business Profile** ?

---

## 6. Ce qui est déjà bien ✅
- Infrastructure SSR complète et correctement configurée (`server.ts`, `render.yaml`, `NG_ALLOWED_HOSTS`, `NG_TRUST_PROXY_HEADERS`).
- Accès navigateur **tous gardés** par `isPlatformBrowser` → prerender sans risque de crash serveur.
- Health check `/api/ping` en place.
- Maillage interne propre via `RouterLink`.
- Contenu déjà rédigé en français, orienté conversion.
- Architecture config-driven (`company.ts`, `social.ts`) → idéale pour centraliser les données SEO.
