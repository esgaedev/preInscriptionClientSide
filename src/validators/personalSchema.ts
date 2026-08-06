import { z } from 'zod';
import { isPlausibleBirthDate } from './patterns';

export const personalSchema = z.object({
  MatriculeBac: z.string().min(1, 'Le matricule du baccalauréat est requis.'),
  Nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  Prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères.'),
  Sexe: z.enum(['M', 'F'], { message: 'Veuillez sélectionner le sexe.' }),
  DateNais: z
    .string()
    .min(1, 'La date de naissance est requise.')
    .refine(isPlausibleBirthDate, 'Veuillez saisir une date de naissance valide.'),
  LieuNais: z.string().min(1, 'Le lieu de naissance est requis.'),
  PaysOrigine: z.string().min(1, 'Le pays d’origine est requis.'), // Peut être auto-rempli selon la nationalité
  IDNationalité: z.number().int().positive('Veuillez sélectionner une nationalité.'),
  DésignNationalité: z.string().min(1),
  Photo: z.string(),
});

export type PersonalStepValues = z.infer<typeof personalSchema>;
