import { PageSeo } from '../../models/seo.model';

/**
 * Métadonnées SEO par page. Chaque composant de page appelle
 * `seo.update(pageSeo.<clé>)` dans son `ngOnInit`.
 */
export const pageSeo = {
  home: {
    title: 'Création de site web & SEO | RaikiServices',
    description:
      'Agence web : sites modernes, rapides et optimisés SEO pour rendre votre entreprise visible et attirer plus de clients. Demandez un devis.',
    path: '',
  },

  websites: {
    title: 'Création de sites web sur mesure | RaikiServices',
    description:
      'Des sites web personnalisés, rapides et responsives, conçus autour de votre entreprise pour convertir vos visiteurs en clients.',
    path: '/sites-web',
  },

  seo: {
    title: 'Référencement SEO Google | RaikiServices',
    description:
      'Améliorez votre classement sur Google et générez un trafic organique qualifié grâce à notre expertise en SEO technique et de contenu.',
    path: '/seo',
  },

  pricing: {
    title: 'Tarifs création de site web | RaikiServices',
    description:
      'Des offres claires et transparentes pour la création de votre site web et votre référencement. Découvrez nos formules.',
    path: '/tarifs',
  },

  caseStudies: {
    title: 'Études de cas clients | RaikiServices',
    description:
      'Résultats concrets de projets web et SEO réalisés pour de vrais clients. Découvrez notre approche et nos performances.',
    path: '/etudes-de-cas',
  },

  portfolio: {
    title: 'Portfolio & réalisations | RaikiServices',
    description:
      'Découvrez notre galerie de créations de sites web modernes réalisés pour nos clients.',
    path: '/portfolio',
  },

  about: {
    title: 'À propos de RaikiServices | Agence web',
    description:
      'Une agence web qui conçoit des sites sur mesure, pensés pour vos clients et construits pour durer. Découvrez notre approche.',
    path: '/a-propos',
  },

  blog: {
    title: 'Blog : conseils web & SEO | RaikiServices',
    description:
      'Nos articles sur la création de sites web, le référencement et la visibilité en ligne. Des conseils concrets pour attirer plus de clients.',
    path: '/blog',
  },

  contact: {
    title: 'Contact & devis | RaikiServices',
    description:
      'Contactez RaikiServices pour votre projet de site web ou de référencement. Demandez un devis gratuit et sans engagement.',
    path: '/contact',
  },

  mentionsLegales: {
    title: 'Mentions légales | RaikiServices',
    description:
      "Éditeur, hébergement, propriété intellectuelle et conditions d'utilisation du site RaikiServices.",
    path: '/mentions-legales',
  },

  privacy: {
    title: 'Politique de confidentialité | RaikiServices',
    description:
      'Quelles données personnelles nous collectons, pourquoi, combien de temps nous les conservons et comment exercer vos droits.',
    path: '/politique-de-confidentialite',
  },

  cookies: {
    title: 'Politique de cookies | RaikiServices',
    description:
      'Les cookies et le stockage local utilisés par RaikiServices, leur finalité et la façon de les gérer depuis votre navigateur.',
    path: '/politique-de-cookies',
  },

  terms: {
    title: 'Conditions générales | RaikiServices',
    description:
      'Le cadre de nos prestations web et SEO : devis, prix, délais, propriété intellectuelle, responsabilité et résiliation.',
    path: '/conditions-generales',
  },

  notFound: {
    title: 'Page introuvable | RaikiServices',
    description:
      "La page demandée n'existe pas ou a été déplacée. Retrouvez nos services de création de site web et de référencement depuis l'accueil.",
    path: '/404',
    noindex: true,
  },

  sandbox: {
    title: 'Sandbox | RaikiServices',
    description: '',
    path: '/sandbox',
    noindex: true,
  },
} satisfies Record<string, PageSeo>;
