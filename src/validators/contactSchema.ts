import { z } from 'zod';

export const contactSchema = z.object({
  Téléphone1: z.string()
    .min(9, 'Le numéro doit contenir exactement 9 chiffres.')
    .max(9, 'Le numéro doit contenir exactement 9 chiffres.')
    .regex(/^\d{9}$/, 'Le numéro doit contenir exactement 9 chiffres.'),
  Téléphone2: z.string().refine((v) => !v || /^\d{9}$/.test(v), 'Le numéro doit contenir exactement 9 chiffres.'),
  Email: z.string().min(1, 'L’adresse e-mail est requise.').email('Adresse e-mail invalide.'),
  Adresse: z.string().min(1, 'L’adresse est requise.'),
  Quartier: z.string().min(1, 'Le quartier est requis.'),
  IDArrondissement: z.number().int().positive('Veuillez sélectionner un arrondissement.'),
  NomPrenom: z.string(),
});

export type ContactStepValues = z.infer<typeof contactSchema>;
