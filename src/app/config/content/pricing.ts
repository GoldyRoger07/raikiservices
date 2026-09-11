/**
 * Contenu de la page des tarifs.
 *
 * <p>Tout y est éditable sans toucher au gabarit : montants, arguments, conditions,
 * questions fréquentes. Seul le nombre de places restantes vit ailleurs — en base, réglable
 * depuis le back-office, parce qu'il change entre deux déploiements.
 *
 * <p>Les montants sont en dollars américains et volontairement ronds : un prix en gourdes
 * devrait être révisé à chaque glissement du taux, et un prix à 3 chiffres après la virgule
 * donne l'impression d'un devis, pas d'une offre.
 */

/** Devise affichée. Sert aussi aux données structurées et aux futures mentions légales. */
export const PRICING_CURRENCY = 'USD';

export interface PricingPlan {
  id: string;
  name: string;
  /** À qui cette formule s'adresse, en une ligne. */
  audience: string;
  /** Prix de création, une seule fois. `null` pour « sur devis ». */
  setupPrice: number | null;
  /** Abonnement mensuel obligatoire : hébergement, domaine, maintenance. */
  monthlyPrice: number;
  /** Vrai pour la formule mise en avant visuellement. */
  highlighted: boolean;
  /** Ce qui distingue cette formule. La première ligne renvoie à la précédente. */
  features: string[];
}

/**
 * Les trois formules.
 *
 * <p>Deux nombres par formule plutôt qu'un seul : le mensuel étant obligatoire, l'annoncer
 * dès la carte évite la mauvaise surprise au moment du devis — et installe l'idée d'une
 * relation suivie plutôt que d'une prestation ponctuelle.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    audience: 'Pour le commerce, le cabinet ou l’artisan qui doit être trouvé et contacté.',
    setupPrice: 390,
    monthlyPrice: 25,
    highlighted: false,
    features: [
      'Site sur mesure de 4 à 5 pages',
      'Adapté au téléphone, à la tablette et à l’ordinateur',
      'Nom de domaine à votre nom, inclus',
      'Hébergement, certificat de sécurité et sauvegardes',
      'Formulaire de contact relié à votre boîte mail',
      'Fiche Google créée et renseignée',
      'Référencement de base et suivi des visites',
      '2 modifications de contenu par mois',
    ],
  },
  {
    id: 'professionnel',
    name: 'Professionnel',
    audience: 'Pour l’entreprise qui veut sortir dans les recherches et convertir.',
    setupPrice: 790,
    monthlyPrice: 45,
    highlighted: true,
    features: [
      'Tout ce que comprend Essentiel',
      'Jusqu’à 10 pages, design poussé',
      'Blog intégré, publiable par vos soins',
      'Référencement local travaillé page par page',
      'Fiche Google optimisée et tenue à jour',
      'Adresses email professionnelles à votre domaine',
      'Rapport de visites tous les mois',
      'Modifications de contenu illimitées',
      'Réponse prioritaire sous 24 h',
    ],
  },
  {
    id: 'sur-mesure',
    name: 'Sur mesure',
    audience: 'Pour la boutique en ligne, la réservation, ou un besoin qui sort du cadre.',
    setupPrice: null,
    monthlyPrice: 75,
    highlighted: false,
    features: [
      'Tout ce que comprend Professionnel',
      'Boutique en ligne ou système de réservation, construite sur mesure',
      'Paiement en ligne configuré',
      'Aucun abonnement à une plateforme tierce : tout est compris',
      'Développement spécifique à votre métier',
      'Accompagnement dédié',
      'Réponse le jour même',
    ],
  },
];

/** Ce que couvre l'abonnement, détaillé une fois pour toutes sous les cartes. */
export const monthlyIncludes = [
  {
    icon: 'pi pi-server',
    title: 'Hébergement et nom de domaine',
    text: 'Votre site est en ligne, rapide et sécurisé. Le nom de domaine est enregistré à votre nom : il vous appartient, quoi qu’il arrive.',
  },
  {
    icon: 'pi pi-shield',
    title: 'Sécurité et sauvegardes',
    text: 'Certificat de sécurité, mises à jour techniques et sauvegardes régulières. Vous n’avez rien à surveiller.',
  },
  {
    icon: 'pi pi-pencil',
    title: 'Modifications de contenu',
    text: 'Un horaire qui change, un nouveau produit, une photo à remplacer : vous écrivez, nous nous en occupons.',
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Suivi et disponibilité',
    text: 'Nous surveillons que votre site répond, et nous vous disons chaque mois combien de personnes l’ont visité.',
  },
];

/**
 * Bloc affiché tant que l'offre de lancement tourne.
 *
 * <p>La raison de l'offre est dite franchement. Une rareté expliquée — nous démarrons, nous
 * construisons notre portfolio — se vérifie et tient dans la durée ; une urgence inventée se
 * remarque, surtout sur un marché où tout le monde se connaît.
 */
export const launchOffer = {
  badge: 'Offre de lancement',
  title: 'Les 10 premiers sites sont offerts.',
  intro:
    'Raiki Services démarre, et nous construisons notre portfolio. Pour nos dix premiers clients, la création du site est offerte et le premier mois d’hébergement aussi. Vous ne payez que l’abonnement, à partir du deuxième mois.',
  /** Ce que vaut le cadeau. Sans point de comparaison, « offert » se lit « sans valeur ». */
  anchorLabel: 'Création du site',
  anchorFrom: 390,
  anchorReplacement: 'Offerte',
  secondLabel: 'Premier mois d’hébergement',
  secondReplacement: 'Offert',
  /** Ce qu'on attend en retour. Une contrepartie claire vaut mieux qu'un cadeau flou. */
  conditionsTitle: 'En échange, nous vous demandons simplement :',
  conditions: [
    'Votre témoignage une fois le site en ligne',
    'L’autorisation de présenter votre projet dans notre portfolio',
    'Vos textes, photos et informations dans un délai raisonnable, pour que le projet avance',
  ],
  /** Ce qui n'est pas dans l'offre, dit avant qu'on ait à le demander. */
  smallPrint:
    'L’abonnement mensuel reste dû à partir du deuxième mois : c’est lui qui maintient votre site en ligne. Aucune durée minimale, vous pouvez arrêter quand vous voulez. Le nom de domaine est enregistré à votre nom dès le premier jour.',
  ctaLabel: 'Je candidate à l’offre',
  /** Préremplit le formulaire de contact, pour reconnaître ces demandes au premier coup d'œil. */
  ctaSubject: 'Candidature à l’offre de lancement',
  slotsLabel: (remaining: number, total: number) =>
    remaining === 1 ? `Dernière place sur ${total}` : `Il reste ${remaining} places sur ${total}`,
};

/**
 * Bloc qui prend la relève quand les dix places sont prises.
 *
 * <p>Prévu dès maintenant : sans lui, la page perdrait son moteur de conversion du jour au
 * lendemain. Le basculement est alors une affaire de contenu, pas de code.
 */
export const standardOffer = {
  badge: 'Avant de vous décider',
  title: 'Voyons d’abord où vous en êtes.',
  intro:
    'Avant de parler d’un site, nous regardons gratuitement ce que donne votre présence en ligne aujourd’hui : ce que trouvent vos clients quand ils cherchent votre nom, ce que font vos concurrents, et ce qui vous ferait gagner le plus. Vous repartez avec le compte rendu, que vous travailliez avec nous ou non.',
  conditionsTitle: 'Ce que comprend ce rendez-vous :',
  conditions: [
    'Un état des lieux de votre visibilité sur Google',
    'Un aperçu de ce que font vos concurrents directs',
    'Une recommandation chiffrée, sans engagement',
  ],
  smallPrint:
    'La création du site peut être réglée en deux fois : la moitié au démarrage, la moitié à la mise en ligne.',
  ctaLabel: 'Demander mon état des lieux',
  ctaSubject: 'Demande d’état des lieux gratuit',
};

/**
 * Questions fréquentes.
 *
 * <p>Une page de tarifs se gagne sur les objections, pas sur la liste des fonctionnalités.
 * Celles-ci répondent aux cinq craintes qui font abandonner : le délai, la propriété, ce qui
 * arrive si on arrête, l'autonomie, et le pourquoi de l'abonnement.
 */
export const pricingFaq = [
  {
    question: 'Combien de temps avant que mon site soit en ligne ?',
    answer:
      'Entre deux et quatre semaines pour un site Essentiel, à partir du moment où nous avons vos textes et vos photos. C’est presque toujours ce délai-là qui décide : plus vous nous transmettez vite votre contenu, plus vite votre site existe.',
  },
  {
    question: 'À qui appartient le site ?',
    answer:
      'Le nom de domaine est enregistré à votre nom dès le premier jour : il est à vous, et vous pouvez l’emmener où vous voulez. Le site, lui, vit sur notre hébergement — c’est ce qui nous permet de le maintenir, de le sauvegarder et de le sécuriser pour vous.',
  },
  {
    question: 'Que se passe-t-il si j’arrête l’abonnement ?',
    answer:
      'Votre site est mis hors ligne à la fin du mois payé, et vous conservez votre nom de domaine. Nous vous prévenons avant, et nous vous remettons vos textes et vos images sur simple demande. Il n’y a aucune durée minimale : vous arrêtez quand vous le décidez.',
  },
  {
    question: 'Pourquoi un abonnement, et pas seulement un prix de création ?',
    answer:
      'Parce qu’un site n’est pas un objet qu’on livre une fois. Il faut l’héberger, renouveler le nom de domaine, appliquer les mises à jour de sécurité, le sauvegarder et corriger ce qui casse. Un site livré puis abandonné devient une vitrine périmée — et souvent une porte d’entrée pour des attaques.',
  },
  {
    question: 'Puis-je modifier mon site moi-même ?',
    answer:
      'Vous pouvez publier vos articles de blog vous-même avec la formule Professionnel. Pour le reste, vous nous écrivez ce que vous voulez changer et nous le faisons — c’est compris dans l’abonnement, et cela vous évite d’avoir à apprendre un outil de plus.',
  },
  {
    question: 'Et si j’ai déjà un site ou un nom de domaine ?',
    answer:
      'Nous reprenons l’existant. Si vous possédez déjà votre nom de domaine, nous le rattachons à votre nouveau site sans que votre adresse change. Si vous avez un site, nous récupérons ce qui mérite de l’être.',
  },
];
