export interface SelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

export const SEXE_OPTIONS: SelectOption[] = [
  { value: 'M', label: 'Masculin' },
  { value: 'F', label: 'Féminin' },
];

/**
 * The API expects a numeric id for `SituationMatrimoniale` (no lookup endpoint
 * was provided). Ordering is assumed — adjust if it doesn't match the
 * backend's actual reference table.
 */
export const SITUATION_MATRIMONIALE_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: 'Célibataire' },
  { value: 2, label: 'Marié(e)' },
  { value: 3, label: 'Divorcé(e)' },
  { value: 4, label: 'Veuf / Veuve' },
];

/**
 * The API expects a numeric id for `SecteurActivité` (no lookup endpoint was
 * provided). Ordering is assumed — adjust if it doesn't match the backend's
 * actual reference table.
 */
export const SECTEUR_ACTIVITE_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: 'Secteur public' },
  { value: 2, label: 'Secteur privé' },
  { value: 3, label: 'Secteur informel' },
  { value: 4, label: 'Aucune activité' },
];

/**
 * The API expects a numeric id for `CatégoriePro` (no lookup endpoint was
 * provided). Ordering is assumed — adjust if it doesn't match the backend's
 * actual reference table.
 * 
 * Spécifications: Catégorie II échelle 2, Catégorie II échelle 1, 
 * Catégorie I échelle 2, Catégorie I échelle 1
 */
export const CATEGORIE_PRO_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: 'Catégorie II échelle 2' },
  { value: 2, label: 'Catégorie II échelle 1' },
  { value: 3, label: 'Catégorie I échelle 2' },
  { value: 4, label: 'Catégorie I échelle 1' },
];

export const RELATION_TUTEUR_OPTIONS: SelectOption[] = [
  { value: 'Oncle', label: 'Oncle' },
  { value: 'Tante', label: 'Tante' },
  { value: 'Frère', label: 'Frère' },
  { value: 'Sœur', label: 'Sœur' },
  { value: 'Grand-parent', label: 'Grand-parent' },
  { value: 'Autre', label: 'Autre' },
];

export const MENTION_OPTIONS: SelectOption[] = [
  { value: 'Passable', label: 'Passable' },
  { value: 'Assez Bien', label: 'Assez Bien' },
  { value: 'Bien', label: 'Bien' },
  { value: 'Très Bien', label: 'Très Bien' },
  { value: 'Excellent', label: 'Excellent' },
];

/**
 * Équivalence du diplôme : de Licence 1 à Master 2 (valeurs 1 à 5)
 */
export const NIVEAU_DIPLOME_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: 'Licence 1' },
  { value: 2, label: 'Licence 2' },
  { value: 3, label: 'Licence 3' },
  { value: 4, label: 'Master 1' },
  { value: 5, label: 'Master 2' },
];
