/**
 * Mapping des niveaux API vers les libellés d'affichage spécifiques
 * Selon les spécifications du système:
 * - 1 → 1ère année en Licence 1
 * - 2 → 2ème année en Licence 2
 * - 3 → 3ème année en Licence 3
 * - 4 → 1ère année de Master 1
 * - 5 → B+4 formation continue (CESAE)
 * - 6 → 2ème année de Master 2
 */
export const NIVEAU_LABELS: Record<number, string> = {
  1: '1ère année de Licence',
  2: '2ème année de Licence',
  3: '3ème année de Licence',
  4: '1ère année de Master',
  5: 'B+4 formation continue (CESAE)',
  6: '2ème année de Master',
  7: 'Doctorat 1',
  8: 'Doctorat 2',
  9: 'Doctorat 3',
};

/** 
 * Convertit le niveau API en libellé d'affichage
 * Fallback vers le label de l'API ou "Niveau X" si inconnu
 */
export function getNiveauLabel(niveauId: number, apiLabel?: string): string {
  return NIVEAU_LABELS[niveauId] ?? apiLabel ?? `Niveau ${niveauId}`;
}
