import { z } from 'zod';

export const professionalSchema = z.object({
  SecteurActivité: z.number().int().min(0, 'Veuillez sélectionner un secteur d’activité.'),
  /** Nombre d'années d'expérience professionnelle (0 = aucune), au plus 2 chiffres. */
  ExpérienceProf: z.number().int().min(0).max(99, 'Maximum 99 ans.'),
  CréateurEntreprise: z.boolean(),
  ProfessionExercée: z.string(),
  FonctionActuelle: z.string(),
  StructureTravail: z.string(),
  CatégoriePro: z.number(),
});

export type ProfessionalStepValues = z.infer<typeof professionalSchema>;
