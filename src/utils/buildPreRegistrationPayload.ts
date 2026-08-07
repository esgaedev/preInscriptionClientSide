import type { PreRegistrationFormValues, PreRegistrationPayload } from '@/types';

/**
 * Strips client-only fields (`diplomas[]._localId`) and separates the flat
 * form state back into the `{ unstEtudiant, tabLigneNiveau }` shape the API
 * expects. `PreMatricule` is never included, matching the API contract.
 *
 * A couple of fields use ergonomic types internally (`Sexe` as `'M' | 'F'`,
 * yes/no fields as `boolean`) but the API expects numeric codes for them —
 * that conversion happens here, once, at the serialization boundary.
 * `ExpérienceProf` (years of experience) is already numeric and passes through
 * unchanged.
 */
export function buildPreRegistrationPayload(
  values: PreRegistrationFormValues,
): PreRegistrationPayload {
  const { diplomas, Sexe, Boursier, CréateurEntreprise, ...rest } = values;

  return {
    unstEtudiant: {
      ...rest,
      Sexe: Sexe === 'M' ? 1 : 2,
      Boursier: Boursier ? 1 : 0,
      CréateurEntreprise: CréateurEntreprise ? 1 : 0,
    },
    tabLigneNiveau: diplomas.map(({ _localId: _omit, ...line }) => line),
  };
}
