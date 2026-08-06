import type { StepId, PreRegistrationFormValues } from '@/types';

/** Field names validated (via RHF `trigger`) before allowing "Next" on each step. */
export const STEP_FIELDS: Partial<Record<StepId, (keyof PreRegistrationFormValues)[]>> = {
  personal: [
    'MatriculeBac',
    'Nom',
    'Prenom',
    'Sexe',
    'DateNais',
    'LieuNais',
    'PaysOrigine',
    'IDNationalité',
    'DésignNationalité',
    'Photo',
  ],

  contact: ['Téléphone1', 'Téléphone2', 'Email', 'Adresse', 'Quartier', 'IDArrondissement'],
  family: [
    'SituationMatrimoniale',
    'OrphelinPère',
    'OrphelinMère',
    'FilleMère',
    'Autochtone',
    'Handicapé',
    'Boursier',
  ],
  professional: [
    'SecteurActivité',
    'ExpérienceProf',
    'CréateurEntreprise',
    // Ces champs ne sont réellement requis (voir le superRefine de
    // preRegistrationSchema) que si SecteurActivité !== « Aucune activité » —
    // les lister ici est donc sans danger : aucune erreur ne remonte quand
    // ils ne s'appliquent pas.
    'ProfessionExercée',
    'FonctionActuelle',
    'StructureTravail',
    'CatégoriePro',
  ],
  parents: [
    'NomPrenomPère',
    'FonctionPère',
    'LieuTravailPère',
    'AdressePère',
    'TéléphonePère',
    'NomPrenomMère',
    'FonctionMère',
    'LieuTravailMère',
    'AdresseMère',
    'TéléphoneMère',
  ],
  guardian: [
    'NomPrénomTuteur',
    'FonctionTuteur',
    'LieuTravailTuteur',
    'AdresseTuteur',
    'TéléphoneTuteur',
    'RelationAvecTuteur',
  ],
  academic: ['AnneeAcademique', 'Niveau', 'IDParcours'],
  diplomas: ['diplomas'],
};
