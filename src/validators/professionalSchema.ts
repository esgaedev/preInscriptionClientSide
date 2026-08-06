import { z } from 'zod';

export const professionalSchema = z.object({
  SecteurActivité: z.number().int().positive('Veuillez sélectionner un secteur d’activité.'),
  ExpérienceProf: z.boolean(),
  CréateurEntreprise: z.boolean(),
  ProfessionExercée: z.string(),
  FonctionActuelle: z.string(),
  StructureTravail: z.string(),
  CatégoriePro: z.number(),
}).refine((data) => {
  const NO_ACTIVITY_ID = 4;
  // Si ce n'est pas "Aucune activité", les champs professionnels sont requis
  if (data.SecteurActivité !== NO_ACTIVITY_ID) {
    return (
      data.ProfessionExercée &&
      data.ProfessionExercée.trim().length > 0 &&
      data.FonctionActuelle &&
      data.FonctionActuelle.trim().length > 0 &&
      data.StructureTravail &&
      data.StructureTravail.trim().length > 0 &&
      data.CatégoriePro &&
      data.CatégoriePro > 0
    );
  }
  return true;
}, {
  message: 'Veuillez remplir tous les champs professionnels lorsque vous avez une activité.',
  path: ['ProfessionExercée'],
});

export type ProfessionalStepValues = z.infer<typeof professionalSchema>;
