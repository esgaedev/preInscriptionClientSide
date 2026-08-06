import { z } from 'zod';

export const familySchema = z.object({
  SituationMatrimoniale: z.number().int().positive('Veuillez sélectionner une situation matrimoniale.'),
  OrphelinPère: z.boolean(),
  OrphelinMère: z.boolean(),
  FilleMère: z.boolean(),
  Autochtone: z.boolean(),
  Handicapé: z.boolean(),
  Boursier: z.boolean(),
});

export type FamilyStepValues = z.infer<typeof familySchema>;
