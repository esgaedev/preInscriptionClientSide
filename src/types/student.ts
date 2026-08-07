/**
 * `STEtudiant` mirrors the backend contract field-for-field (including its
 * accentuation quirks, e.g. `NomPrenomPère` vs `NomPrénomTuteur`). Field names
 * must never be altered — the API deserializes on exact key matches.
 *
 * This is the **form-level** shape: a few fields use ergonomic internal
 * representations (e.g. `Sexe` as `'M' | 'F'`, yes/no fields as `boolean`)
 * even though the API expects numeric codes for them. The conversion to the
 * exact wire format happens once, in `buildPreRegistrationPayload` — see
 * `STEtudiantWirePayload` below for the shape actually sent over the wire.
 */
export interface STEtudiant {
  MatriculeBac: string;
  Nom: string;
  Prenom: string;
  Sexe: 'M' | 'F';
  DateNais: string;
  LieuNais: string;
  PaysOrigine: string;
  /** Base64 data-URI of the compressed ID photo, or empty string if none. */
  Photo: string;
  Téléphone1: string;
  Téléphone2: string;
  Email: string;
  Adresse: string;
  NomPrenom: string;
  IDNationalité: number;
  DésignNationalité: string;
  Boursier: boolean;
  IDArrondissement: number;
  Quartier: string;
  /** Id of the marital-status option (see SITUATION_MATRIMONIALE_OPTIONS). */
  SituationMatrimoniale: number;
  /** Id of the activity-sector option (see SECTEUR_ACTIVITE_OPTIONS). */
  SecteurActivité: number;
  /** Nombre d'années d'expérience professionnelle (0 = aucune). */
  ExpérienceProf: number;
  CréateurEntreprise: boolean;
  ProfessionExercée: string;
  FonctionActuelle: string;
  StructureTravail: string;
  /** Id of the professional-category option (see CATEGORIE_PRO_OPTIONS). */
  CatégoriePro: number;
  OrphelinPère: boolean;
  OrphelinMère: boolean;
  FilleMère: boolean;
  Autochtone: boolean;
  Handicapé: boolean;
  NomPrenomPère: string;
  FonctionPère: string;
  LieuTravailPère: string;
  AdressePère: string;
  TéléphonePère: string;
  NomPrenomMère: string;
  FonctionMère: string;
  LieuTravailMère: string;
  AdresseMère: string;
  TéléphoneMère: string;
  NomPrénomTuteur: string;
  FonctionTuteur: string;
  LieuTravailTuteur: string;
  AdresseTuteur: string;
  TéléphoneTuteur: string;
  RelationAvecTuteur: string;
  AnneeAcademique: string;
  Niveau: number;
  IDParcours: number;
  /** Server-generated. Present when the API returns a record, never sent on create. */
  PreMatricule: string;
}

/** Form-level shape (ergonomic types), everything except the server-generated id. */
export type STEtudiantPayload = Omit<STEtudiant, 'PreMatricule'>;

/**
 * Exact shape expected by `POST API/pre-inscription` under the `unstEtudiant`
 * key: `Sexe` and the yes/no fields are numeric codes (1/2, 0/1) rather than
 * the ergonomic string/boolean values used internally by the form.
 * `ExpérienceProf` is already numeric (years of experience) — no conversion
 * needed for it.
 */
export type STEtudiantWirePayload = Omit<
  STEtudiantPayload,
  'Sexe' | 'Boursier' | 'CréateurEntreprise'
> & {
  Sexe: 1 | 2;
  Boursier: 0 | 1;
  CréateurEntreprise: 0 | 1;
};
