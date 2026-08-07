import { z } from 'zod';
import { personalSchema } from './personalSchema';
import { contactSchema } from './contactSchema';
import { familySchema } from './familySchema';
import { professionalSchema } from './professionalSchema';
import { parentsSchema } from './parentsSchema';
import { guardianSchema } from './guardianSchema';
import { academicSchema } from './academicSchema';
import { diplomasSchema } from './diplomaSchema';
import { NO_ACTIVITY_SECTOR_ID } from '@/constants/options';

/**
 * Single schema backing the whole wizard. Steps call `trigger([...fieldNames])`
 * (see `STEP_FIELDS`) so only the relevant slice of errors surfaces per step,
 * while cross-field rules below still apply once at final validation.
 */
export const preRegistrationSchema = personalSchema
  .extend(contactSchema.shape)
  .extend(familySchema.shape)
  .extend(professionalSchema.shape)
  .extend(parentsSchema.shape)
  .extend(guardianSchema.shape)
  .extend(academicSchema.shape)
  .extend(diplomasSchema.shape)
  .superRefine((data, ctx) => {
    if (!data.OrphelinPère && !data.NomPrenomPère) {
      ctx.addIssue({
        code: 'custom',
        path: ['NomPrenomPère'],
        message: 'Le nom du père est requis (ou cochez « orphelin de père »).',
      });
    }
    if (!data.OrphelinMère && !data.NomPrenomMère) {
      ctx.addIssue({
        code: 'custom',
        path: ['NomPrenomMère'],
        message: 'Le nom de la mère est requis (ou cochez « orpheline de mère »).',
      });
    }

    if (data.SecteurActivité !== NO_ACTIVITY_SECTOR_ID) {
      if (!data.ProfessionExercée.trim()) {
        ctx.addIssue({ code: 'custom', path: ['ProfessionExercée'], message: 'Précisez votre profession exercée.' });
      }
      if (!data.FonctionActuelle.trim()) {
        ctx.addIssue({ code: 'custom', path: ['FonctionActuelle'], message: 'Précisez votre fonction actuelle.' });
      }
      if (!data.StructureTravail.trim()) {
        ctx.addIssue({ code: 'custom', path: ['StructureTravail'], message: 'Précisez votre structure de travail.' });
      }
      if (!data.CatégoriePro) {
        ctx.addIssue({
          code: 'custom',
          path: ['CatégoriePro'],
          message: 'Veuillez sélectionner une catégorie professionnelle.',
        });
      }
    }
  });

export type PreRegistrationSchema = z.infer<typeof preRegistrationSchema>;
