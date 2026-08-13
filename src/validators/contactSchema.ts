import { z } from 'zod';
const phoneRegex = /^\+\d{8,15}$/;

export const contactSchema = z.object({
  Téléphone1: z.string()
    .regex(
      phoneRegex,
      'Le numéro doit être au format international, par exemple +242067453245.'
    ),

  Téléphone2: z.string()
    .refine(
      (v) => !v || phoneRegex.test(v),
      'Le numéro doit être au format international, par exemple +242067453245.'
    ),

  Email: z.string()
    .min(1, 'L’adresse e-mail est requise.')
    .email('Adresse e-mail invalide.'),

  Adresse: z.string().min(1, 'L’adresse est requise.'),

  Quartier: z.string().min(1, 'Le quartier est requis.'),

  IDArrondissement: z.number()
    .int()
    .positive('Veuillez sélectionner un arrondissement.'),

  NomPrenom: z.string(),
});

export type ContactStepValues = z.infer<typeof contactSchema>;
