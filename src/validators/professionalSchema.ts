import { z } from 'zod';

export const professionalSchema = z.object({
  SecteurActivité: z.number().int().positive('Veuillez sélectionner un secteur d’activité.'),
  ExpérienceProf: z.boolean(),
  CréateurEntreprise: z.boolean(),
  ProfessionExercée: z.string(),
  FonctionActuelle: z.string(),
  StructureTravail: z.string(),
  CatégoriePro: z.number(),
});

export type ProfessionalStepValues = z.infer<typeof professionalSchema>;
