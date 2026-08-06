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
    // Les champs suivants sont validés dynamiquement selon si l'utilisateur a une activité
    // 'ProfessionExercée',
    // 'FonctionActuelle',
    // 'StructureTravail',
    // 'CatégoriePro',
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
