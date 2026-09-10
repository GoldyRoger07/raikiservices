/**
 * Fonctions partagées par les deux pages publiques du blog.
 *
 * <p>Le back-office enregistre le corps d'un article tel qu'il a été tapé (voir l'aide sous
 * le champ « Contenu » de l'éditeur) : on ne sait pas d'avance si le rédacteur a écrit du
 * HTML ou du texte brut. `looksLikeHtml` tranche, et la page d'article choisit entre un
 * rendu `[innerHTML]` — assaini par Angular, qui retire scripts et gestionnaires d'événements
 * — et un découpage en paragraphes, interpolé donc échappé.
 */

/** Balises de structure : leur présence signale un corps rédigé en HTML. */
const HTML_BLOCK_TAG =
  /<(p|h[1-6]|ul|ol|li|div|section|article|blockquote|img|br|hr|figure|table|pre|a)\b/i;

export function looksLikeHtml(content: string | null | undefined): boolean {
  return !!content && HTML_BLOCK_TAG.test(content);
}

/** Découpe un texte brut en paragraphes, sur les lignes vides. */
export function toParagraphs(content: string | null | undefined): string[] {
  if (!content) {
    return [];
  }
  return content
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * Date lisible en français.
 *
 * <p>`Intl` plutôt que `DatePipe` : aucune locale n'est enregistrée dans l'application, le
 * pipe rendrait donc « September » au lieu de « septembre ». `Intl` est disponible au
 * navigateur comme au rendu serveur, et ne dépend d'aucune configuration Angular.
 */
export function formatFrenchDate(iso: string | null | undefined): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Temps de lecture estimé en minutes, sur une base de 200 mots par minute. */
export function readingTime(content: string | null | undefined): number {
  if (!content) {
    return 1;
  }
  const words = content
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
