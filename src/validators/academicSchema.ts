import { z } from 'zod';

export const academicSchema = z.object({
  AnneeAcademique: z.string().min(1, 'Année académique introuvable.'),
  Niveau: z.number().int().positive('Veuillez sélectionner un niveau.'),
  IDParcours: z.number().int().positive('Veuillez sélectionner un parcours.'),
});

export type AcademicStepValues = z.infer<typeof academicSchema>;
