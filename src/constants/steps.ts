import type { StepDefinition } from '@/types';

export const STEPS: StepDefinition[] = [
  {
    id: 'personal',
    title: 'Informations personnelles',
    description: 'Identité, naissance et pièce jointe',
  },
  {
    id: 'contact',
    title: 'Coordonnées',
    description: 'Téléphone, e-mail et adresse',
  },
  {
    id: 'family',
    title: 'Situation familiale',
    description: 'Situation matrimoniale et particularités',
  },
  {
    id: 'professional',
    title: 'Informations professionnelles',
    description: 'Activité et expérience professionnelle',
  },
  {
    id: 'parents',
    title: 'Informations des parents',
    description: 'Père et mère',
  },
  {
    id: 'guardian',
    title: 'Informations du tuteur',
    description: 'Contact du tuteur légal',
  },
  {
    id: 'academic',
    title: 'Choix académiques',
    description: 'Année, niveau et parcours',
  },
  {
    id: 'diplomas',
    title: 'Diplômes obtenus',
    description: 'Ajoutez vos diplômes précédents',
  },
  {
    id: 'engagement',
    title: 'Charte d\'engagement',
    description: 'Acceptation des conditions',
  },
  {
    id: 'summary',
    title: 'Récapitulatif',
    description: 'Vérifiez toutes vos informations',
  },
  {
    id: 'confirmation',
    title: 'Validation finale',
    description: 'Envoi de votre pré-inscription',
  },
];

export const STEP_COUNT = STEPS.length;
