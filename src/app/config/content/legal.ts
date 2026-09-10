import { LegalDocument } from '../../models/legal.model';

/**
 * Contenu des quatre pages légales du site.
 *
 * ⚠️ Les mentions entre crochets `[À COMPLÉTER : …]` sont des informations que seule
 * l'entreprise détient (immatriculation, siège social, représentant légal, conditions
 * tarifaires, juridiction compétente…). Elles sont volontairement laissées vides plutôt
 * qu'inventées : un document légal qui affirme un faux numéro d'immatriculation est pire
 * qu'un document incomplet. Renseignez-les avant la mise en ligne, puis faites relire
 * l'ensemble par un juriste — ces textes sont une base de travail, pas un avis juridique.
 *
 * Les éléments techniques (données collectées, cookies déposés, sous-traitants) sont, eux,
 * exacts : ils décrivent ce que le code fait réellement aujourd'hui. Ils sont à revoir si
 * un outil de mesure d'audience, un paiement en ligne ou un nouveau formulaire est ajouté.
 */

const UPDATED_AT = '4 septembre 2026';

const CONTACT_EMAIL = 'contact@raikiservices.com';
const CONTACT_PHONE = '(509) 34 97 7530';

// ────────────────────────────────────────────────────────────────────────────
// Mentions légales
// ────────────────────────────────────────────────────────────────────────────

export const mentionsLegales: LegalDocument = {
  heroTitle: 'Mentions légales',
  heroDesc:
    "Les informations relatives à l'éditeur, à l'hébergement et aux conditions d'utilisation du site raikiservices.com.",
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: 'Éditeur du site',
      blocks: [
        {
          kind: 'p',
          text: "Le site accessible à l'adresse www.raikiservices.com est édité par :",
        },
        {
          kind: 'list',
          items: [
            'Dénomination sociale : Raiki Services',
            // '[À COMPLÉTER : forme juridique de la société]',
            // "[À COMPLÉTER : numéro d'immatriculation / identifiant fiscal]",
            // '[À COMPLÉTER : adresse du siège social]',
            `Téléphone : ${CONTACT_PHONE}`,
            `Adresse électronique : ${CONTACT_EMAIL}`,
          ],
        },
      ],
    },
    {
      title: 'Directeur de la publication',
      blocks: [
        {
          kind: 'p',
          text: "Le directeur de la publication est LATOUCHE Gerson, en sa qualité de représentant légal de l'éditeur.",
        },
      ],
    },
    {
      title: 'Nous contacter',
      blocks: [
        {
          kind: 'p',
          text: `Pour toute question relative au site ou à son contenu, vous pouvez nous écrire à ${CONTACT_EMAIL}, nous appeler au ${CONTACT_PHONE}, ou utiliser le formulaire de contact du site. Nous nous efforçons de répondre sous 24 heures ouvrées.`,
        },
      ],
    },
    {
      title: 'Hébergement',
      blocks: [
        {
          kind: 'p',
          text: 'Le site web est hébergé par Render Services, Inc., dont les services sont accessibles à l\'adresse render.com.',
        },
        {
          kind: 'p',
          text: "Les données applicatives du site (messages reçus via le formulaire de contact, comptes d'administration) sont stockées dans une base de données hébergée chez Railway Corporation.",
        },
      ],
    },
    {
      title: 'Propriété intellectuelle',
      blocks: [
        {
          kind: 'p',
          text: "L'ensemble des éléments composant le site — structure, textes, illustrations, photographies, logos, identité visuelle, code source et bases de données — est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive de Raiki Services ou de ses partenaires, sauf mention contraire.",
        },
        {
          kind: 'p',
          text: "Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, de ces éléments, par quelque procédé que ce soit et sur quelque support que ce soit, est interdite sans autorisation écrite préalable. Les projets clients présentés dans les rubriques Portfolio et Études de cas restent la propriété de leurs titulaires respectifs et sont publiés avec leur accord.",
        },
      ],
    },
    {
      title: 'Liens hypertextes',
      blocks: [
        {
          kind: 'p',
          text: "Le site peut renvoyer vers des sites tiers, notamment vers les réseaux sociaux et vers les sites de nos clients. Ces liens sont proposés à titre d'information : nous n'exerçons aucun contrôle sur ces sites et déclinons toute responsabilité quant à leur contenu, à leur disponibilité et aux pratiques de leurs éditeurs en matière de données personnelles.",
        },
        {
          kind: 'p',
          text: "La mise en place d'un lien vers le site est libre, à condition qu'elle ne porte pas atteinte à l'image de Raiki Services et qu'elle n'induise pas en erreur sur l'origine du contenu.",
        },
      ],
    },
    {
      title: 'Disponibilité et responsabilité',
      blocks: [
        {
          kind: 'p',
          text: "Nous mettons tout en œuvre pour que les informations publiées sur le site soient exactes et tenues à jour, et pour que le site reste accessible en permanence. Nous ne pouvons toutefois garantir ni l'exhaustivité de ces informations, ni une disponibilité sans interruption : le site peut être suspendu temporairement pour maintenance, mise à jour ou en raison d'un incident technique.",
        },
        {
          kind: 'p',
          text: "Les informations présentées, notamment les descriptions de prestations et les indications tarifaires, ont une valeur informative et ne constituent pas une offre contractuelle. Seul un devis signé engage Raiki Services.",
        },
        {
          kind: 'p',
          text: "Il vous appartient de prendre les mesures appropriées pour protéger votre équipement et vos données, notamment contre les logiciels malveillants.",
        },
      ],
    },
    {
      title: 'Signalement',
      blocks: [
        {
          kind: 'p',
          text: `Si vous estimez qu'un contenu publié sur ce site porte atteinte à vos droits, notamment à un droit de propriété intellectuelle ou à votre image, écrivez-nous à ${CONTACT_EMAIL} en précisant l'adresse de la page concernée, l'élément visé et le motif de votre demande. Nous examinerons votre signalement dans les meilleurs délais.`,
        },
      ],
    },
    {
      title: 'Données personnelles et cookies',
      blocks: [
        {
          kind: 'p',
          text: "Le traitement des données personnelles est décrit dans notre Politique de confidentialité. L'usage des cookies et du stockage local est décrit dans notre Politique de cookies. Ces deux documents sont accessibles depuis le pied de page du site.",
        },
      ],
    },
    {
      title: 'Droit applicable',
      blocks: [
        {
          kind: 'p',
          text: "Les présentes mentions légales sont régies et interprétées conformément au droit en vigueur en République d’Haïti. En cas de litige relatif à l’utilisation du site, les parties s’efforceront de rechercher une solution amiable avant toute action judiciaire. À défaut de résolution amiable, tout litige sera soumis aux juridictions haïtiennes compétentes.",
        },
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Politique de confidentialité
// ────────────────────────────────────────────────────────────────────────────

export const politiqueConfidentialite: LegalDocument = {
  heroTitle: 'Politique de confidentialité',
  heroDesc:
    'Quelles données nous collectons, pourquoi, combien de temps nous les conservons et comment exercer vos droits.',
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: 'Notre engagement',
      blocks: [
        {
          kind: 'p',
          text: "Raiki Services attache une importance particulière à la protection de votre vie privée. Nous ne collectons que les données nécessaires à la relation que vous engagez avec nous, nous ne les vendons pas et nous ne les utilisons pas à des fins de publicité ciblée.",
        },
        {
          kind: 'p',
          text: "Cette politique décrit ce que nous faisons réellement des informations que vous nous confiez sur ce site. Elle s'applique au site www.raikiservices.com et aux échanges qui en découlent.",
        },
      ],
    },
    {
      title: 'Responsable du traitement',
      blocks: [
        {
          kind: 'p',
          text: `Le responsable du traitement est Raiki Services, [À COMPLÉTER : forme juridique, immatriculation et siège social]. Pour toute question relative à vos données, écrivez-nous à ${CONTACT_EMAIL}.`,
        },
      ],
    },
    {
      title: 'Données que nous collectons',
      blocks: [
        {
          kind: 'p',
          text: 'Formulaire de contact — lorsque vous nous adressez une demande depuis le site, nous enregistrons :',
        },
        {
          kind: 'list',
          items: [
            'votre prénom (obligatoire) et votre nom',
            'votre adresse électronique (obligatoire)',
            'votre numéro de téléphone, si vous le renseignez',
            'le nom de votre société, si vous le renseignez',
            'la prestation qui vous intéresse et le sujet de votre demande',
            'le contenu de votre message (obligatoire)',
            "votre accord éventuel pour recevoir nos actualités",
            'la date et l\'heure de votre envoi',
          ],
        },
        {
          kind: 'p',
          text: "Suivi interne — une fois votre message reçu, notre équipe lui associe un statut d'avancement (nouveau, en cours, contacté, gagné, perdu) et peut y ajouter des notes internes destinées au suivi commercial de votre demande.",
        },
        {
          kind: 'p',
          text: "Comptes d'administration — les membres de notre équipe disposent d'un compte pour accéder à l'espace d'administration du site. Y sont enregistrés leur nom d'utilisateur, leur adresse électronique, leur mot de passe sous forme chiffrée, et le cas échéant leur nom, téléphone, fonction, photo et biographie. Ces comptes ne sont pas ouverts aux visiteurs du site.",
        },
        {
          kind: 'p',
          text: "Journaux de connexion — pour sécuriser l'espace d'administration, nous conservons l'historique des tentatives de connexion (adresse électronique utilisée, adresse IP, navigateur, succès ou échec) ainsi que la liste des sessions ouvertes (appareil, adresse IP, dates de création et de dernière activité).",
        },
        {
          kind: 'p',
          text: "Nous ne collectons aucune donnée sensible au sens de la réglementation (origine, opinions, santé, orientation sexuelle…) et nous vous demandons de ne pas nous en communiquer dans vos messages.",
        },
      ],
    },
    {
      title: 'Pourquoi nous les utilisons',
      blocks: [
        {
          kind: 'list',
          items: [
            "Répondre à votre demande et établir un devis : c'est la finalité principale du formulaire de contact. Le traitement repose sur votre demande, préalable à la conclusion d'un éventuel contrat.",
            "Assurer le suivi commercial de votre projet et conserver l'historique de nos échanges : ce traitement repose sur notre intérêt légitime à gérer notre activité.",
            "Vous envoyer nos actualités : uniquement si vous avez coché la case correspondante, et donc sur la base de votre consentement, que vous pouvez retirer à tout moment.",
            "Sécuriser l'accès à l'espace d'administration et détecter les tentatives d'intrusion : ce traitement repose sur notre intérêt légitime à protéger le site et les données qui y sont stockées.",
            "Respecter nos obligations légales, notamment comptables, lorsqu'une relation contractuelle est engagée.",
          ],
        },
      ],
    },
    {
      title: 'Qui a accès à vos données',
      blocks: [
        {
          kind: 'p',
          text: "Vos données sont accessibles aux seuls membres de l'équipe Raiki Services habilités à traiter votre demande. L'espace d'administration repose sur un système de rôles et de permissions : chaque membre n'accède qu'aux informations nécessaires à sa mission.",
        },
        {
          kind: 'p',
          text: 'Nous faisons appel aux prestataires techniques suivants, qui agissent pour notre compte et selon nos instructions :',
        },
        {
          kind: 'list',
          items: [
            "Render Services, Inc. (render.com) — hébergement du site web.",
            "[À COMPLÉTER : hébergeur de la base de données et du serveur applicatif] — stockage des messages reçus et des comptes d'administration.",
            "Resend — acheminement des courriels transactionnels : accusé de réception de votre message, notification interne à notre équipe, réinitialisation de mot de passe.",
          ],
        },
        {
          kind: 'p',
          text: "Nous ne cédons, ne louons et ne vendons vos données à aucun tiers. Elles peuvent être communiquées à une autorité administrative ou judiciaire lorsque la loi nous y oblige.",
        },
      ],
    },
    {
      title: 'Transferts hors de votre pays',
      blocks: [
        {
          kind: 'p',
          text: "Certains de nos prestataires techniques sont établis à l'étranger, notamment aux États-Unis. Vos données peuvent donc être hébergées ou traitées en dehors de votre pays de résidence. Nous sélectionnons des prestataires offrant des garanties contractuelles appropriées quant à la sécurité et à la confidentialité des données.",
        },
      ],
    },
    {
      title: 'Combien de temps nous les conservons',
      blocks: [
        {
          kind: 'list',
          items: [
            "Messages du formulaire de contact restés sans suite : [À COMPLÉTER : durée retenue, par exemple 3 ans à compter du dernier échange].",
            "Dossiers ayant donné lieu à une relation contractuelle : pendant la durée de la relation, puis pendant la durée de prescription applicable et les délais légaux de conservation comptable.",
            "Coordonnées utilisées pour l'envoi de nos actualités : jusqu'à votre désinscription.",
            "Comptes d'administration : pendant la durée des fonctions de leur titulaire au sein de l'équipe.",
            "Journaux de connexion et sessions : les sessions expirent automatiquement et sont supprimées ; l'historique des connexions est conservé [À COMPLÉTER : durée retenue, par exemple 12 mois] à des fins de sécurité.",
          ],
        },
      ],
    },
    {
      title: 'Comment nous les protégeons',
      blocks: [
        {
          kind: 'p',
          text: 'Nous appliquons des mesures techniques et organisationnelles adaptées, parmi lesquelles :',
        },
        {
          kind: 'list',
          items: [
            'la transmission des données en HTTPS entre votre navigateur et nos serveurs ;',
            "le stockage des mots de passe sous forme d'empreintes chiffrées non réversibles, jamais en clair ;",
            "un accès à l'administration protégé par jeton d'authentification à durée de vie courte, dont le jeton de renouvellement est déposé dans un cookie inaccessible au code JavaScript ;",
            "un cloisonnement des droits par rôles et permissions, revu à chaque évolution du site ;",
            "la possibilité de révoquer à distance toute session ouverte, notamment en cas de perte d'un appareil.",
          ],
        },
        {
          kind: 'p',
          text: "Aucun système n'étant infaillible, nous vous invitons à nous signaler sans délai toute anomalie que vous constateriez.",
        },
      ],
    },
    {
      title: 'Vos droits',
      blocks: [
        {
          kind: 'p',
          text: 'Dans les conditions prévues par la réglementation applicable, vous disposez des droits suivants :',
        },
        {
          kind: 'list',
          items: [
            "droit d'accès : obtenir la confirmation que des données vous concernant sont traitées et en recevoir une copie ;",
            'droit de rectification : faire corriger des données inexactes ou incomplètes ;',
            "droit à l'effacement : demander la suppression de vos données lorsque leur conservation n'est plus justifiée ;",
            'droit à la limitation : demander le gel temporaire du traitement, le temps qu\'une contestation soit examinée ;',
            "droit d'opposition : vous opposer à un traitement fondé sur notre intérêt légitime, pour des raisons tenant à votre situation ;",
            'droit à la portabilité : recevoir dans un format structuré les données que vous nous avez fournies ;',
            'droit de retirer votre consentement à tout moment, lorsque le traitement repose sur celui-ci, sans que cela remette en cause la licéité du traitement effectué auparavant.',
          ],
        },
        {
          kind: 'p',
          text: `Pour exercer ces droits, écrivez-nous à ${CONTACT_EMAIL} en précisant votre demande. Nous pourrons être amenés à vous demander un justificatif d'identité si un doute subsiste sur l'origine de la demande. Nous vous répondons dans un délai d'un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l'autorité de protection des données compétente [À COMPLÉTER : autorité de contrôle applicable].`,
        },
      ],
    },
    {
      title: 'Actualités et désinscription',
      blocks: [
        {
          kind: 'p',
          text: `Si vous avez accepté de recevoir nos actualités, chaque message comporte un lien de désinscription. Vous pouvez également nous en faire la demande à ${CONTACT_EMAIL} : votre adresse est alors retirée de nos envois, sans que cela affecte le suivi de votre demande commerciale.`,
        },
      ],
    },
    {
      title: 'Mineurs',
      blocks: [
        {
          kind: 'p',
          text: "Le site s'adresse à des professionnels et à des personnes majeures. Nous ne collectons pas sciemment de données concernant des mineurs. Si vous constatez qu'un mineur nous a transmis des informations, signalez-le nous : nous les supprimerons.",
        },
      ],
    },
    {
      title: 'Évolution de cette politique',
      blocks: [
        {
          kind: 'p',
          text: "Cette politique peut être modifiée pour tenir compte d'évolutions du site, de nos outils ou de la réglementation. La date de dernière mise à jour figure en tête de page. En cas de changement significatif, nous en informerons les personnes concernées par un moyen approprié.",
        },
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Politique de cookies
// ────────────────────────────────────────────────────────────────────────────

export const politiqueCookies: LegalDocument = {
  heroTitle: 'Politique de cookies',
  heroDesc:
    'Ce que nous déposons sur votre appareil, à quoi cela sert, et comment en reprendre le contrôle.',
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: 'De quoi parle-t-on',
      blocks: [
        {
          kind: 'p',
          text: "Un cookie est un petit fichier déposé sur votre appareil lors de la consultation d'un site, et renvoyé au serveur à chaque visite. Le stockage local est un mécanisme voisin : l'information reste dans votre navigateur et n'est jamais transmise au serveur. Cette page couvre les deux.",
        },
      ],
    },
    {
      title: 'Ce que nous utilisons réellement',
      blocks: [
        {
          kind: 'p',
          text: "Le site n'utilise aujourd'hui aucun cookie publicitaire, aucun traceur de réseau social et aucun outil de mesure d'audience. Les seuls éléments déposés sont strictement nécessaires à son fonctionnement :",
        },
        {
          kind: 'list',
          items: [
            "app-theme (stockage local) — mémorise votre préférence d'affichage entre le mode clair et le mode sombre, afin de la retrouver à votre prochaine visite. Cette information ne quitte jamais votre navigateur. Conservation : jusqu'à ce que vous effaciez les données du site.",
            "refresh_token (cookie) — déposé uniquement lorsqu'un membre de notre équipe se connecte à l'espace d'administration. Il permet de maintenir la session ouverte sans redemander le mot de passe à chaque page. Il est inaccessible au code JavaScript, limité au domaine de notre API et restreint aux requêtes issues de notre propre site. Conservation : jusqu'à la déconnexion, ou expiration automatique. Ce cookie n'est jamais déposé chez un simple visiteur du site.",
          ],
        },
        {
          kind: 'p',
          text: "Ces éléments étant indispensables à la fourniture du service que vous demandez, ils ne requièrent pas votre consentement préalable. C'est également la raison pour laquelle le site n'affiche pas de bandeau de consentement.",
        },
      ],
    },
    {
      title: 'Ressources chargées depuis des tiers',
      blocks: [
        {
          kind: 'p',
          text: "Certaines ressources d'affichage — une bibliothèque de carrousel et des polices de caractères — sont chargées depuis des réseaux de diffusion de contenu tiers. Ces services ne déposent pas de cookie, mais reçoivent techniquement l'adresse IP de votre appareil, comme tout serveur qui vous transmet un fichier.",
        },
        {
          kind: 'p',
          text: "Les pages qui intègrent un contenu externe, par exemple une vidéo ou une carte, peuvent en revanche donner lieu au dépôt de cookies par le fournisseur concerné, soumis à ses propres conditions. Aucun contenu de ce type n'est intégré au site à ce jour.",
        },
      ],
    },
    {
      title: 'Gérer ou supprimer ces éléments',
      blocks: [
        {
          kind: 'p',
          text: 'Vous restez maître de ce qui est stocké sur votre appareil. Chaque navigateur permet de consulter, bloquer ou effacer les cookies et le stockage local, généralement depuis ses réglages :',
        },
        {
          kind: 'list',
          items: [
            'Google Chrome : Paramètres › Confidentialité et sécurité › Cookies et autres données des sites',
            'Mozilla Firefox : Paramètres › Vie privée et sécurité › Cookies et données de sites',
            'Microsoft Edge : Paramètres › Cookies et autorisations de site',
            'Safari : Réglages › Safari › Confidentialité et sécurité',
          ],
        },
        {
          kind: 'p',
          text: "La navigation privée constitue une autre option : les éléments déposés y sont effacés à la fermeture de la fenêtre.",
        },
      ],
    },
    {
      title: 'Conséquences du refus',
      blocks: [
        {
          kind: 'p',
          text: "Bloquer ces éléments n'empêche pas la consultation du site : les pages, le formulaire de contact et les informations restent pleinement accessibles. Vous perdrez simplement la mémorisation du mode d'affichage. En revanche, l'accès à l'espace d'administration devient impossible sans le cookie de session, celui-ci étant le mécanisme même de l'authentification.",
        },
      ],
    },
    {
      title: 'Évolution',
      blocks: [
        {
          kind: 'p',
          text: "Si nous mettions en place un outil de mesure d'audience ou tout autre traceur non essentiel, cette page serait mise à jour et un mécanisme de recueil du consentement serait installé avant tout dépôt. Nous vous invitons à consulter la date de mise à jour en tête de page.",
        },
        {
          kind: 'p',
          text: "Le traitement des données personnelles auquel ces éléments peuvent contribuer est détaillé dans notre Politique de confidentialité.",
        },
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Conditions générales
// ────────────────────────────────────────────────────────────────────────────

export const conditionsGenerales: LegalDocument = {
  heroTitle: 'Conditions générales',
  heroDesc:
    "Le cadre de nos prestations de création de sites web et de référencement : commande, prix, délais, droits et responsabilités.",
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: 'Objet et champ d\'application',
      blocks: [
        {
          kind: 'p',
          text: "Les présentes conditions générales régissent, d'une part l'utilisation du site www.raikiservices.com, d'autre part les prestations de conception, de refonte, de référencement, d'hébergement et de maintenance de sites web fournies par Raiki Services (ci-après « le Prestataire ») à ses clients (ci-après « le Client »).",
        },
        {
          kind: 'p',
          text: "Toute commande implique l'acceptation sans réserve des présentes conditions, qui prévalent sur les conditions d'achat du Client, sauf accord écrit contraire. Le Prestataire se réserve la faculté de les modifier ; la version applicable est celle en vigueur à la date de signature du devis.",
        },
      ],
    },
    {
      title: 'Utilisation du site',
      blocks: [
        {
          kind: 'p',
          text: "Le site est mis à disposition à titre informatif. Vous vous engagez à en faire un usage loyal, à ne pas tenter d'en perturber le fonctionnement, d'accéder à des espaces réservés, ni d'extraire massivement son contenu. Les informations et tarifs indicatifs qui y figurent ne constituent pas une offre contractuelle.",
        },
      ],
    },
    {
      title: 'Devis et formation du contrat',
      blocks: [
        {
          kind: 'p',
          text: "Toute prestation fait l'objet d'un devis détaillé, précisant son périmètre, ses livrables, son calendrier et son prix. Le devis est valable [À COMPLÉTER : durée de validité, par exemple 30 jours] à compter de son émission.",
        },
        {
          kind: 'p',
          text: "Le contrat est formé à la date de réception par le Prestataire du devis accepté par le Client, accompagné le cas échéant de l'acompte prévu. Toute demande sortant du périmètre décrit au devis fait l'objet d'un avenant chiffré préalable.",
        },
      ],
    },
    {
      title: 'Prix, facturation et paiement',
      blocks: [
        {
          kind: 'list',
          items: [
            'Les prix sont ceux indiqués au devis, exprimés en [À COMPLÉTER : devise] et [À COMPLÉTER : hors taxes ou toutes taxes comprises].',
            "Un acompte de [À COMPLÉTER : pourcentage] est exigible à la commande ; le solde est facturé [À COMPLÉTER : à la livraison, ou selon l'échéancier du devis].",
            'Les factures sont payables sous [À COMPLÉTER : délai de paiement] à compter de leur date d\'émission.',
            'Tout retard de paiement entraîne, après mise en demeure restée sans effet, [À COMPLÉTER : pénalités applicables] et peut justifier la suspension des prestations en cours, y compris de l\'hébergement et de la maintenance.',
            "Les abonnements (hébergement, maintenance, accompagnement) sont facturés d'avance selon la périodicité prévue au devis.",
          ],
        },
      ],
    },
    {
      title: 'Obligations du Prestataire',
      blocks: [
        {
          kind: 'p',
          text: "Le Prestataire s'engage à exécuter les prestations avec le soin et la compétence attendus de sa profession, à respecter le périmètre convenu et à tenir le Client informé de l'avancement du projet. Il est tenu d'une obligation de moyens.",
        },
        {
          kind: 'p',
          text: "Il se réserve la possibilité de faire appel à des sous-traitants pour tout ou partie des prestations, tout en demeurant responsable de leur exécution vis-à-vis du Client.",
        },
      ],
    },
    {
      title: 'Obligations du Client',
      blocks: [
        {
          kind: 'p',
          text: "La bonne exécution du projet suppose une collaboration active du Client, qui s'engage à :",
        },
        {
          kind: 'list',
          items: [
            'désigner un interlocuteur unique disposant du pouvoir de valider les étapes du projet ;',
            'fournir dans les délais convenus l\'ensemble des contenus nécessaires (textes, images, logos, accès techniques) ;',
            'répondre aux demandes de validation dans un délai raisonnable ;',
            'garantir qu\'il détient les droits sur les éléments qu\'il transmet, et garantir le Prestataire contre toute réclamation d\'un tiers à ce titre ;',
            'conserver la confidentialité des identifiants qui lui sont remis et signaler sans délai toute utilisation suspecte.',
          ],
        },
        {
          kind: 'p',
          text: "Tout retard imputable au Client dans la fourniture des contenus ou des validations décale d'autant le calendrier de livraison, sans que le Prestataire puisse en être tenu responsable.",
        },
      ],
    },
    {
      title: 'Délais et livraison',
      blocks: [
        {
          kind: 'p',
          text: "Les délais figurant au devis sont donnés à titre indicatif et courent à compter de la réception de l'acompte et de l'ensemble des éléments nécessaires au démarrage. Un dépassement raisonnable ne peut donner lieu ni à annulation de la commande, ni à indemnité.",
        },
      ],
    },
    {
      title: 'Recette et validation',
      blocks: [
        {
          kind: 'p',
          text: "À la livraison, le Client dispose de [À COMPLÉTER : durée de la période de recette, par exemple 15 jours] pour vérifier la conformité de la prestation au devis et signaler par écrit les anomalies constatées. Passé ce délai, ou en cas de mise en ligne à l'initiative du Client, la prestation est réputée acceptée.",
        },
        {
          kind: 'p',
          text: "Les corrections d'anomalies signalées durant cette période sont prises en charge par le Prestataire. Les demandes d'évolution, distinctes des corrections, font l'objet d'un devis complémentaire.",
        },
      ],
    },
    {
      title: 'Propriété intellectuelle',
      blocks: [
        {
          kind: 'p',
          text: "Les droits d'exploitation des créations réalisées spécifiquement pour le Client — maquettes, identité visuelle, textes rédigés par le Prestataire — lui sont cédés à compter du paiement intégral du prix. Avant complet paiement, le Prestataire demeure titulaire de l'ensemble des droits.",
        },
        {
          kind: 'p',
          text: "Demeurent en revanche la propriété du Prestataire ou de leurs éditeurs respectifs : les outils, bibliothèques, composants et savoir-faire réutilisables mobilisés pour la réalisation, ainsi que les éléments sous licence tierce (polices, images de banque, extensions), dont le Client acquiert un droit d'usage dans les limites de la licence concernée.",
        },
        {
          kind: 'p',
          text: "Sauf refus écrit du Client, le Prestataire se réserve le droit de citer le projet et d'en présenter des visuels dans ses références commerciales, son portfolio et ses études de cas.",
        },
      ],
    },
    {
      title: 'Hébergement et maintenance',
      blocks: [
        {
          kind: 'p',
          text: "Lorsque le devis prévoit une prestation d'hébergement ou de maintenance, celle-ci s'exécute sous forme d'abonnement, reconductible selon la périodicité convenue et résiliable par chacune des parties moyennant un préavis de [À COMPLÉTER : durée du préavis].",
        },
        {
          kind: 'p',
          text: "Le Prestataire ne peut garantir une disponibilité ininterrompue : des interruptions peuvent survenir du fait des opérateurs, de l'hébergeur ou d'opérations de maintenance, dont le Client est prévenu lorsqu'elles sont programmées. La sauvegarde des données fait l'objet des modalités précisées au devis.",
        },
        {
          kind: 'p',
          text: "À l'issue de la relation contractuelle, le Prestataire remet au Client, sur demande, les éléments nécessaires à la reprise du site par un tiers.",
        },
      ],
    },
    {
      title: 'Référencement',
      blocks: [
        {
          kind: 'p',
          text: "Les prestations de référencement consistent à optimiser le site au regard des bonnes pratiques reconnues. Le positionnement dans les résultats de recherche dépendant d'algorithmes tiers, évolutifs et indépendants de la volonté du Prestataire, celui-ci est tenu d'une obligation de moyens et ne garantit aucun classement, ni aucun volume de trafic ou de conversion.",
        },
      ],
    },
    {
      title: 'Confidentialité',
      blocks: [
        {
          kind: 'p',
          text: "Chacune des parties s'engage à conserver confidentielles les informations, documents et données de l'autre dont elle aurait connaissance à l'occasion du contrat, et à ne pas les divulguer sans accord écrit préalable. Cet engagement demeure pendant [À COMPLÉTER : durée] après la fin de la relation contractuelle.",
        },
      ],
    },
    {
      title: 'Responsabilité',
      blocks: [
        {
          kind: 'p',
          text: "La responsabilité du Prestataire ne peut être engagée qu'en cas de faute prouvée et se limite aux dommages directs. Sont exclus les dommages indirects, notamment la perte de chiffre d'affaires, de clientèle, de données ou d'image.",
        },
        {
          kind: 'p',
          text: "En tout état de cause, l'indemnisation éventuellement due par le Prestataire ne saurait excéder le montant des sommes effectivement perçues au titre de la prestation en cause.",
        },
        {
          kind: 'p',
          text: "Le Prestataire ne saurait être tenu responsable du contenu publié par le Client sur son site, ni des conséquences d'une modification effectuée par le Client ou par un tiers sans son intervention.",
        },
      ],
    },
    {
      title: 'Résiliation',
      blocks: [
        {
          kind: 'p',
          text: "En cas de manquement de l'une des parties à l'une de ses obligations, non réparé dans un délai de [À COMPLÉTER : délai] suivant une mise en demeure écrite, l'autre partie peut résilier le contrat de plein droit.",
        },
        {
          kind: 'p',
          text: "En cas de résiliation par le Client d'un projet en cours, les prestations déjà réalisées restent dues au prorata de leur avancement, et les acomptes versés demeurent acquis au Prestataire.",
        },
      ],
    },
    {
      title: 'Force majeure',
      blocks: [
        {
          kind: 'p',
          text: "Aucune des parties ne peut être tenue responsable d'un manquement résultant d'un événement de force majeure, entendu comme un événement extérieur, imprévisible et irrésistible, notamment une catastrophe naturelle, un conflit, une interruption durable des réseaux de télécommunication ou d'alimentation électrique. Les obligations sont suspendues pendant la durée de l'événement ; si celui-ci se prolonge au-delà de [À COMPLÉTER : durée], chacune des parties peut résilier le contrat sans indemnité.",
        },
      ],
    },
    {
      title: 'Données personnelles',
      blocks: [
        {
          kind: 'p',
          text: "Le traitement des données personnelles collectées via le site est décrit dans notre Politique de confidentialité. Lorsque, dans le cadre d'une prestation, le Prestataire traite des données personnelles pour le compte du Client, les parties définissent par écrit les conditions de ce traitement, conformément à la réglementation applicable.",
        },
      ],
    },
    {
      title: 'Droit applicable et litiges',
      blocks: [
        {
          kind: 'p',
          text: "Les présentes conditions sont soumises à [À COMPLÉTER : droit applicable]. En cas de différend, les parties s'efforcent de trouver une solution amiable avant toute action contentieuse. À défaut d'accord, le litige relève de la compétence de [À COMPLÉTER : juridiction compétente].",
        },
        {
          kind: 'p',
          text: `Pour toute réclamation, écrivez-nous à ${CONTACT_EMAIL} ou appelez-nous au ${CONTACT_PHONE}.`,
        },
      ],
    },
  ],
};

/** Les quatre documents, indexés par clé de route — utile pour un éventuel écran d'édition. */
export const legalDocuments = {
  mentionsLegales,
  politiqueConfidentialite,
  politiqueCookies,
  conditionsGenerales,
} satisfies Record<string, LegalDocument>;
