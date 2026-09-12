/**
 * Une question fréquente et sa réponse.
 *
 * <p>Partagée par le composant d'affichage (`components/faqs`) et par les jeux de questions
 * rangés dans `config/content/faq.ts` — et par `pricingFaq`, resté avec les tarifs qu'il
 * défend. Un seul type pour tous : les données structurées FAQPage émises par
 * `faq-section` s'appuient dessus, et une FAQ dont une entrée n'aurait pas de réponse
 * produirait un balisage invalide.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}
