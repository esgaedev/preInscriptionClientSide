import type { STEtudiantWirePayload } from './student';
import type { LigneNiveauPayload } from './diploma';

/** Exact body sent to `POST API/pre-inscription`. */
export interface PreRegistrationPayload {
  unstEtudiant: STEtudiantWirePayload;
  tabLigneNiveau: LigneNiveauPayload[];
}

/** Response returned by the API after a successful pre-registration. */
export interface PreRegistrationResponse {
  unstEtudiant: {
    PreMatricule: string;
    [key: string]: unknown;
  };
  tabLigneNiveau: LigneNiveauPayload[];
}
