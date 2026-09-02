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

  contact: {
    title: 'Contact & devis | RaikiServices',
    description:
      'Contactez RaikiServices pour votre projet de site web ou de référencement. Demandez un devis gratuit et sans engagement.',
    path: '/contact',
  },

  sandbox: {
    title: 'Sandbox | RaikiServices',
    description: '',
    path: '/sandbox',
    noindex: true,
  },
} satisfies Record<string, PageSeo>;
