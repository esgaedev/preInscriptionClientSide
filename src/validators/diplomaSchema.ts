import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const diplomaLineSchema = z.object({
  _localId: z.string(),
  Diplôme: z.string().min(1, 'Le nom du diplôme est requis.'),
  Mention: z.string().min(1, 'Veuillez sélectionner une mention.'),
  Année: z
    .number()
    .int()
    .min(1950, 'Année invalide.')
    .max(currentYear, `L’année ne peut pas dépasser ${currentYear}.`),
  ETS: z.string().min(1, 'L’établissement est requis.'),
  Lieu: z.string().min(1, 'Le lieu d’obtention est requis.'),
  NiveauDiplome: z.number().int().positive('Veuillez sélectionner un niveau de diplôme.'),
});

export const diplomasSchema = z.object({
  diplomas: z.array(diplomaLineSchema).min(1, 'Ajoutez au moins un diplôme obtenu.').max(1, 'Un seul diplôme est autorisé.'),
});

export type DiplomaLineValues = z.infer<typeof diplomaLineSchema>;
export type DiplomasStepValues = z.infer<typeof diplomasSchema>;
