import { z } from 'zod';
import { PHONE_REGEX } from './patterns';

const optionalPhone = z
  .string()
  .refine((v) => !v || PHONE_REGEX.test(v), 'Numéro de téléphone invalide.');

export const parentsSchema = z.object({
  NomPrenomPère: z.string(),
  FonctionPère: z.string(),
  LieuTravailPère: z.string(),
  AdressePère: z.string(),
  TéléphonePère: optionalPhone,
  NomPrenomMère: z.string(),
  FonctionMère: z.string(),
  LieuTravailMère: z.string(),
  AdresseMère: z.string(),
  TéléphoneMère: optionalPhone,
});

export type ParentsStepValues = z.infer<typeof parentsSchema>;
