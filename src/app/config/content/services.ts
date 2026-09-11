/**
 * Contenu des deux pages de services : `/sites-web` et `/seo`.
 *
 * <p>Regroupé ici pour une raison précise : ces pages décrivent ce que la page des tarifs
 * facture. Tant que les deux contenus vivaient dans leurs composants respectifs, rien
 * n'empêchait `/seo` de promettre du netlinking qu'aucune formule ne comprend. Les voisiner
 * avec `pricing.ts` rend l'écart visible au moment de l'écriture.
 *
 * <p>Les classes de couleur sont écrites en toutes lettres, jamais composées : Tailwind
 * n'analyse que du texte, et un `bg-${tone}-100` assemblé à l'exécution ne produirait
 * aucune règle.
 */

export interface ServiceCard {
  title: string;
  description: string;
  /** Classe PrimeIcons, couleur comprise. */
  icon: string;
  /** Fond de la pastille d'icône. */
  iconBackground: string;
  /** Points détaillés, sur la page SEO uniquement. */
  details?: string[];
  /** Où cette prestation se situe dans les formules. Voir `coverageLabels`. */
  coverage?: ServiceCoverage;
}

/**
 * Rattachement d'une prestation à l'offre commerciale.
 *
 * <p>Sans cette information, la page des services promet et la page des tarifs facture,
 * sans que le visiteur sache laquelle croire.
 */
export type ServiceCoverage = 'all' | 'essentiel' | 'professionnel' | 'dedicated';

export const coverageLabels: Record<ServiceCoverage, string> = {
  all: 'Compris dans tous nos sites',
  essentiel: 'Compris dès la formule Essentiel',
  professionnel: 'Compris dans la formule Professionnel',
  dedicated: 'Accompagnement dédié, sur devis',
};

// ──────────────── Création de sites ────────────────

export const websiteServices: ServiceCard[] = [
  {
    title: 'Sites vitrines',
    description:
      'Des sites complets qui mettent en valeur vos services, votre équipe, votre adresse et vos contacts. Le socle de votre présence en ligne.',
    icon: 'pi pi-briefcase text-gray-500',
    iconBackground: 'bg-gray-100',
  },
  {
    title: 'Boutiques en ligne',
    description:
      'Présentez vos produits, encaissez en ligne et suivez vos commandes. La boutique est construite sur mesure et fait partie de votre site : pas de plateforme tierce à payer en plus, et vos clients ne changent jamais d’adresse.',
    icon: 'pi pi-shopping-cart text-green-500',
    iconBackground: 'bg-green-100',
  },
  {
    title: 'Pages de campagne',
    description:
      'Une page unique, pensée pour une promotion ou un lancement, et dont le seul but est de transformer un clic en prise de contact.',
    icon: 'pi pi-bullseye text-yellow-500',
    iconBackground: 'bg-yellow-100',
  },
  {
    title: 'Refonte de site',
    description:
      'Votre site paraît daté ou se charge lentement ? Nous le reprenons entièrement, en préservant les adresses déjà connues de Google.',
    icon: 'pi pi-sync text-violet-500',
    iconBackground: 'bg-violet-100',
  },
  {
    title: 'Portfolios',
    description:
      'Mettez votre travail en avant. Pensé pour les créatifs, les photographes, les indépendants et les agences.',
    icon: 'pi pi-id-card text-pink-500',
    iconBackground: 'bg-pink-100',
  },
  {
    title: 'Prise de rendez-vous',
    description:
      'Vos clients réservent directement depuis votre site. Adapté aux salons, cliniques, consultants et métiers de service.',
    icon: 'pi pi-calendar text-blue-500',
    iconBackground: 'bg-blue-100',
  },
];

// ──────────────── Référencement ────────────────

export const seoServices: ServiceCard[] = [
  {
    title: 'Performance technique',
    description:
      'Vitesse d’affichage, confort sur téléphone, exploration par les moteurs. Ce sont les défauts silencieux qui pénalisent le plus, et ils se règlent à la construction.',
    icon: 'pi pi-desktop text-blue-500',
    iconBackground: 'bg-blue-100',
    coverage: 'all',
    details: [
      'Optimisation de la vitesse des pages',
      'Affichage adapté aux téléphones',
      'Correction des erreurs d’exploration',
    ],
  },
  {
    title: 'Référencement local',
    description:
      'Apparaître sur Google Maps et dans les résultats de proximité. Nous créons et tenons votre fiche Google pour que vos voisins vous trouvent en premier.',
    icon: 'pi pi-map-marker text-green-500',
    iconBackground: 'bg-green-100',
    coverage: 'essentiel',
    details: [
      'Création et renseignement de la fiche Google',
      'Inscription dans les annuaires locaux',
      'Accompagnement sur les avis clients',
    ],
  },
  {
    title: 'Positionnement sur vos mots-clés',
    description:
      'Nous travaillons la structure et le contenu de chaque page pour les termes que vos clients tapent réellement — pas ceux qu’on imagine.',
    icon: 'pi pi-chart-line text-gray-500',
    iconBackground: 'bg-gray-100',
    coverage: 'professionnel',
    details: [
      'Recherche des mots-clés qui vous concernent',
      'Optimisation page par page',
      'Audit technique de référencement',
    ],
  },
  {
    title: 'Suivi et rapports',
    description:
      'Des chiffres sans explication ne servent à rien. Nous installons la mesure et vous disons chaque mois ce qui a bougé, et ce qu’il faut en faire.',
    icon: 'pi pi-chart-bar text-yellow-500',
    iconBackground: 'bg-yellow-100',
    coverage: 'professionnel',
    details: [
      'Mise en place de la mesure d’audience',
      'Suivi des recherches qui vous amènent des visiteurs',
      'Rapport mensuel commenté',
    ],
  },
  {
    title: 'Stratégie de contenu',
    description:
      'Nous identifions les questions que se posent vos clients et produisons les contenus qui y répondent — c’est ce qui installe votre autorité sur la durée.',
    icon: 'pi pi-pencil text-violet-500',
    iconBackground: 'bg-violet-100',
    coverage: 'dedicated',
    details: [
      'Plan de publication du blog',
      'Rédaction et optimisation des articles',
      'Actualisation des contenus existants',
    ],
  },
  {
    title: 'Notoriété et liens entrants',
    description:
      'Des liens venus de sites crédibles indiquent à Google qu’on peut vous faire confiance. Nous les obtenons par une vraie démarche, sans achat ni raccourci.',
    icon: 'pi pi-link text-pink-500',
    iconBackground: 'bg-pink-100',
    coverage: 'dedicated',
    details: [
      'Prospection auprès de sites pertinents',
      'Publications invitées',
      'Nettoyage des liens nuisibles',
    ],
  },
];

/**
 * Rappel du modèle commercial, repris sur les deux pages de services.
 *
 * <p>Un visiteur qui lit `/sites-web` doit savoir qu'un abonnement mensuel existe avant
 * d'arriver au devis. Le découvrir plus tard, c'est la mauvaise surprise qui fait perdre la
 * vente — et la confiance.
 */
export const servicePricingNote = {
  title: 'Combien ça coûte, et comment ça se passe',
  intro:
    'Un montant à la création, réglé une fois, puis un abonnement mensuel qui garde votre site en ligne, sauvegardé et à jour. Pas de frais de renouvellement surprise.',
  points: [
    {
      icon: 'pi pi-credit-card',
      text: 'La création se règle une seule fois, à partir de 390 $ selon l’ampleur du site.',
    },
    {
      icon: 'pi pi-refresh',
      text: 'L’abonnement démarre à 25 $ par mois : hébergement, nom de domaine, sécurité, sauvegardes et modifications de contenu.',
    },
    {
      icon: 'pi pi-key',
      text: 'Le nom de domaine est enregistré à votre nom. Il vous appartient, quoi qu’il arrive.',
    },
  ],
  ctaLabel: 'Voir le détail des formules',
  ctaLink: '/tarifs',
};
