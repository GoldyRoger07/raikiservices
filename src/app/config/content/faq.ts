import { FaqEntry } from '../../models/faq.model';

/**
 * Questions fréquentes des pages du site vitrine.
 *
 * <p>Un jeu par page plutôt qu'une FAQ unique répétée partout : le visiteur d'une page de
 * service ne se pose pas les mêmes questions que celui d'un formulaire de contact, et une
 * même FAQ recopiée d'une page à l'autre produit surtout du contenu dupliqué.
 *
 * <p>Les questions des tarifs vivent avec eux (`pricingFaq`, dans `pricing.ts`) : ce sont les
 * objections sur les montants, et les écrire loin des montants revient à les laisser
 * diverger. Les réponses ci-dessous ne doivent rien promettre que `pricing.ts` et
 * `services.ts` ne tiennent — délais, propriété du domaine, contenu des formules.
 *
 * <p>Chaque bloc est repris tel quel dans les données structurées FAQPage émises par
 * `faq-section` : ce sont des réponses lues par des moteurs autant que par des visiteurs.
 * D'où des réponses complètes, qui se suffisent à elles-mêmes hors de la page.
 */

/**
 * Accueil : les questions qu'on se pose avant même de savoir ce qu'on veut.
 *
 * <p>Volontairement générales — prix, délai, effort demandé. Le détail des formules est
 * l'affaire de `/tarifs`, vers laquelle la réponse renvoie plutôt que de la recopier.
 */
export const homeFaq: FaqEntry[] = [
  {
    question: 'Combien coûte un site web chez Raiki Services ?',
    answer:
      'La création part de 390 $ pour un site vitrine de 4 à 5 pages, puis un abonnement mensuel à partir de 25 $ maintient le site en ligne : hébergement, nom de domaine, sécurité, sauvegardes et modifications de contenu. Les trois formules et ce que chacune comprend sont détaillées sur la page Tarifs.',
  },
  {
    question: 'Combien de temps faut-il pour mettre mon site en ligne ?',
    answer:
      'Entre deux et quatre semaines pour un site vitrine, à compter du moment où nous avons vos textes et vos photos. C’est presque toujours le contenu qui décide du délai : plus vous nous le transmettez tôt, plus vite votre site existe.',
  },
  {
    question: 'Qu’attendez-vous de moi pour démarrer ?',
    answer:
      'Ce que vous seul possédez : la description de votre activité, vos services et vos tarifs, vos coordonnées et vos horaires, et quelques photos de votre entreprise. Nous nous chargeons du reste — structure, mise en forme, design, mise en ligne — et nous vous guidons à chaque étape si vous n’avez pas encore ce matériel.',
  },
  {
    question: 'Mon site apparaîtra-t-il sur Google ?',
    answer:
      'Oui. Tous nos sites sont construits pour être lus correctement par les moteurs de recherche, et nous créons et renseignons votre fiche Google dès la formule Essentiel pour que vous ressortiez dans les recherches de proximité. Le positionnement sur des mots-clés concurrentiels, lui, demande un travail suivi que nous menons dans la formule Professionnel.',
  },
  {
    question: 'À quoi sert l’abonnement mensuel ?',
    answer:
      'Un site n’est pas un objet qu’on livre une fois : il doit être hébergé, son nom de domaine renouvelé, ses mises à jour de sécurité appliquées, ses sauvegardes faites, et ses contenus corrigés quand ils changent. C’est exactement ce que couvre l’abonnement. Il n’y a aucune durée minimale : vous arrêtez quand vous le décidez.',
  },
  {
    question: 'Travaillez-vous avec des entreprises hors de Pétion-Ville ?',
    answer:
      'Oui. Nous accompagnons des entreprises à Pétion-Ville, à Port-au-Prince et ailleurs, et l’ensemble du projet peut se mener à distance — par téléphone, par email et par visioconférence. Le suivi mensuel fonctionne de la même façon, où que vous soyez.',
  },
];

/**
 * `/sites-web` : ce qui reste flou une fois les types de sites présentés.
 *
 * <p>La page décrit ce que nous construisons ; ces questions répondent au « et dans mon
 * cas ? » — un site existant, une boutique, des textes qu'on n'a pas.
 */
export const websitesFaq: FaqEntry[] = [
  {
    question: 'De quel type de site mon entreprise a-t-elle besoin ?',
    answer:
      'Un site vitrine de quelques pages suffit à la plupart des commerces, cabinets et artisans : il présente l’activité, installe la confiance et amène des appels. Une boutique en ligne ne se justifie que si vous vendez réellement à distance et pouvez livrer. Nous vous le disons franchement lors du premier échange, même si cela nous fait proposer moins.',
  },
  {
    question: 'J’ai déjà un site : pouvez-vous le refaire ?',
    answer:
      'Oui, et c’est fréquent. Nous repartons de l’existant : nous récupérons ce qui mérite de l’être — textes, photos, pages qui vous amènent déjà des visiteurs — et nous rattachons votre nom de domaine actuel au nouveau site, sans que votre adresse change.',
  },
  {
    question: 'Mon site fonctionnera-t-il sur téléphone ?',
    answer:
      'Oui, et c’est la première chose que nous vérifions. La majorité de vos visiteurs vous découvriront depuis un téléphone : chaque page est pensée pour cet écran, puis adaptée à la tablette et à l’ordinateur. Aucune version mobile séparée, aucun supplément.',
  },
  {
    question: 'Qui écrit les textes et fournit les photos ?',
    answer:
      'Vous nous transmettez la matière — ce que vous faites, pour qui, à quel prix, et les photos de votre activité — et nous nous chargeons de la structurer et de la mettre en forme pour le web. Si vous n’avez pas de photos exploitables, nous vous orientons vers une solution avant que cela ne bloque le projet.',
  },
  {
    question: 'Le site m’appartient-il ?',
    answer:
      'Le nom de domaine est enregistré à votre nom dès le premier jour : il est à vous, et vous pouvez l’emmener où vous voulez. Le site, lui, vit sur notre hébergement — c’est ce qui nous permet de le maintenir, de le sauvegarder et de le sécuriser pour vous dans le cadre de l’abonnement.',
  },
  {
    question: 'Que se passe-t-il une fois le site en ligne ?',
    answer:
      'Le travail continue : nous hébergeons le site, appliquons les mises à jour de sécurité, le sauvegardons, surveillons qu’il répond, et effectuons les modifications de contenu que vous nous demandez. Vous n’avez aucun outil à apprendre : vous nous écrivez ce qui change, nous le faisons.',
  },
];

/**
 * `/seo` : les questions qui décident si le visiteur croit ce que la page vient de dire.
 *
 * <p>Deux réponses y sont volontairement décevantes — le délai, et l'absence de garantie de
 * première place. Un référenceur qui promet le contraire se fait démentir par les faits au
 * bout de trois mois ; autant le dire avant la signature.
 */
export const seoFaq: FaqEntry[] = [
  {
    question: 'En combien de temps verrai-je des résultats sur Google ?',
    answer:
      'Comptez trois à six mois pour un mouvement net sur des recherches concurrentielles. Le référencement local va plus vite : une fiche Google bien créée et renseignée peut vous faire apparaître dans les recherches de proximité en quelques semaines. Méfiez-vous de quiconque vous promet la première place en un mois.',
  },
  {
    question: 'Garantissez-vous la première place sur Google ?',
    answer:
      'Non, et personne ne le peut honnêtement : le classement dépend de l’algorithme de Google et de ce que font vos concurrents, deux choses qui ne nous appartiennent pas. Ce que nous garantissons, c’est le travail : un site techniquement propre, des pages optimisées sur les termes que vos clients tapent réellement, et un rapport mensuel qui vous montre ce qui a bougé.',
  },
  {
    question: 'Le référencement est-il compris dans le prix du site ?',
    answer:
      'Les bases le sont dans tous nos sites : performance technique, affichage sur téléphone, structure lisible par les moteurs, suivi des visites. La fiche Google et le référencement local sont compris dès la formule Essentiel. Le travail page par page sur vos mots-clés et le rapport mensuel commenté relèvent de la formule Professionnel. La stratégie de contenu et l’acquisition de liens, qui demandent un travail suivi, font l’objet d’un devis séparé.',
  },
  {
    question: 'Qu’est-ce que le référencement local, et me concerne-t-il ?',
    answer:
      'C’est le fait d’apparaître quand quelqu’un cherche un service près de chez lui — « restaurant Pétion-Ville », « plombier près de moi ». Si vous recevez des clients à une adresse ou intervenez dans une zone donnée, c’est le levier le plus rentable pour vous. Il passe par votre fiche Google, les annuaires locaux et les avis clients, que nous prenons en charge.',
  },
  {
    question: 'Faut-il publier un blog pour être bien référencé ?',
    answer:
      'Pas pour exister dans les résultats : un site clair, rapide et bien structuré suffit à ressortir sur votre nom et vos services. Le blog sert à autre chose — répondre aux questions que se posent vos clients avant d’acheter, et installer votre autorité sur la durée. Il est intégré à la formule Professionnel, publiable par vos soins.',
  },
  {
    question: 'Pouvez-vous travailler le référencement d’un site que vous n’avez pas réalisé ?',
    answer:
      'Nous commençons toujours par un état des lieux : ce que trouvent vos clients quand ils cherchent votre nom, ce que font vos concurrents, et ce qui vous ferait gagner le plus. S’il est possible de corriger l’existant, nous vous le disons. Si le site est trop lent ou trop mal construit pour qu’un travail de référencement paie, nous vous le disons aussi, plutôt que de facturer un effort sans effet.',
  },
];

/**
 * `/contact` : lever ce qui retient encore la main au-dessus du bouton d'envoi.
 *
 * <p>Courte à dessein — la page a un formulaire à faire remplir, pas une lecture à proposer.
 * Les réponses portent sur le délai, l'engagement et la suite, pas sur l'offre.
 */
export const contactFaq: FaqEntry[] = [
  {
    question: 'Sous quel délai répondez-vous ?',
    answer:
      'Sous 24 heures. Si votre demande est urgente, appelez-nous au (509) 34 97 7530 : c’est plus rapide qu’un email.',
  },
  {
    question: 'Le premier échange est-il payant ou engageant ?',
    answer:
      'Ni l’un ni l’autre. Nous discutons de votre activité et de ce que vous voulez accomplir, nous regardons où vous en êtes en ligne, et nous vous disons ce qui nous paraît le plus utile. Vous repartez avec cet avis, que vous travailliez avec nous ensuite ou non.',
  },
  {
    question: 'Que dois-je préparer avant de vous écrire ?',
    answer:
      'Rien de particulier. Dites-nous simplement ce que fait votre entreprise, ce que vous aimeriez obtenir d’un site, et si vous avez déjà un site ou un nom de domaine. Le reste se construit avec nous.',
  },
  {
    question: 'Comment se passe la suite ?',
    answer:
      'Nous vous répondons pour comprendre votre besoin, puis nous vous envoyons une proposition chiffrée. Si elle vous convient, nous recueillons vos contenus et le projet démarre : comptez deux à quatre semaines jusqu’à la mise en ligne d’un site vitrine.',
  },
];
