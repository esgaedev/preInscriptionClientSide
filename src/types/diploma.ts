/**
 * Diplôme response from API /API/Diplome
 */
export interface Diploma {
  IDDiplôme: number;
  DésignDiplôme: string;
}

/**
 * A single row of `tabLigneNiveau`. The list is fully dynamic on the client
 * (add / edit / remove) before being flattened into the POST payload.
 */
export interface LigneNiveau {
  /** Client-only key for React lists / edit-in-place; stripped before POST. */
  _localId: string;
  /** Free-text name of the diploma, e.g. "Licence Informatique". */
  Diplôme: string;
  Mention: string;
  Année: number;
  /** Établissement ayant délivré le diplôme. */
  ETS: string;
  Lieu: string;
  /** Id of the diploma level — only the id is sent, the Select shows the label. */
  NiveauDiplome: number;
}

export type LigneNiveauPayload = Omit<LigneNiveau, '_localId'>;
