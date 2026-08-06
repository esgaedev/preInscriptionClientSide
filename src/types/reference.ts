/**
 * Shapes returned by the reference-data endpoints consumed while filling the form.
 * The backend contract only guarantees a label + an identifier; extra fields are
 * tolerated (and ignored) so the UI stays resilient to additive API changes.
 */

export interface AcademicYear {
  /** Raw identifier/label as returned by the API — used verbatim as `AnneeAcademique`. */
  AnneeAcademique: string;
  [key: string]: unknown;
}

export interface Level {
  /** Numeric id — this is the only value sent back to the API as `Niveau`. */
  Niveau: number;
  [key: string]: unknown;
}

export interface Course {
  /** Numeric id — this is the only value sent back to the API as `IDParcours`. */
  IDParcours: number;
  /** Human-readable course name shown in the Select. */
  NomParcours: string;
  /** Id of the level this course is offered at — used to filter the Parcours select by the chosen Niveau. */
  Niveau?: number;
  [key: string]: unknown;
}

export interface Nationality {
  /** Numeric id — this is the only value sent back to the API as `IDNationalité`. */
  IDNationalité: number;
  /** Human-readable label shown in the Select and sent as `DésignNationalité`. */
  DésignNationalité: string;
  [key: string]: unknown;
}
