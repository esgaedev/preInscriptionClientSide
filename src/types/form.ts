import type { STEtudiantPayload } from './student';
import type { LigneNiveau } from './diploma';

/**
 * Single source of truth for the whole multi-step wizard. Every step reads
 * and writes a slice of this shape via the shared `useFormContext`.
 */
export interface PreRegistrationFormValues extends STEtudiantPayload {
  diplomas: LigneNiveau[];
}

export type StepId =
  | 'personal'
  | 'contact'
  | 'family'
  | 'professional'
  | 'parents'
  | 'guardian'
  | 'academic'
  | 'diplomas'
  | 'engagement'
  | 'summary'
  | 'confirmation';

export interface StepDefinition {
  id: StepId;
  title: string;
  description: string;
}
