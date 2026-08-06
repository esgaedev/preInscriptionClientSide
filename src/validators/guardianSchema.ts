import { z } from 'zod';
import { PHONE_REGEX } from './patterns';

export const guardianSchema = z.object({
  NomPrénomTuteur: z.string().min(2, 'Le nom du tuteur est requis.'),
  FonctionTuteur: z.string(),
  LieuTravailTuteur: z.string(),
  AdresseTuteur: z.string(),
  TéléphoneTuteur: z.string().regex(PHONE_REGEX, 'Numéro de téléphone invalide.'),
  RelationAvecTuteur: z.string().min(1, 'Veuillez préciser la relation avec le tuteur.'),
});

export type GuardianStepValues = z.infer<typeof guardianSchema>;
