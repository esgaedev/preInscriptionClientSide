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

export const NO_ACTIVITY_SECTOR_ID = 0;

/**
 * The API expects a numeric id for `SecteurActivité`. "Aucune activité" must
 * be 0.
 */
export const SECTEUR_ACTIVITE_OPTIONS: SelectOption<number>[] = [
  { value: NO_ACTIVITY_SECTOR_ID, label: 'Aucune activité' },
  { value: 1, label: 'Secteur public' },
  { value: 2, label: 'Secteur privé' },
  { value: 3, label: 'Secteur informel' },
];

/**
 * Grille catégorie/échelon pour `CatégoriePro`.
 */
export const CATEGORIE_PRO_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: 'Catégorie I échelon 1' },
  { value: 2, label: 'Catégorie I échelon 2' },
  { value: 3, label: 'Catégorie II échelon 1' },
  { value: 4, label: 'Catégorie II échelon 2' },
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
 * Équivalence du diplôme : Baccalauréat=1, puis Licence 1 à Master 2 (2 à 6).
 * NOTE: la valeur exacte de "Licence 1" n'était pas explicite dans la demande
 * (juste "Baccalauréat=1 ... Licence 2=2 etc") — séquence continue assumée
 * ici ; à corriger si elle ne correspond pas à la table de référence réelle.
 */
export const NIVEAU_DIPLOME_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: 'Baccalauréat' },
  { value: 2, label: 'Licence 1' },
  { value: 3, label: 'Licence 2' },
  { value: 4, label: 'Licence 3' },
  { value: 5, label: 'Master 1' },
  { value: 6, label: 'Master 2' },
];
