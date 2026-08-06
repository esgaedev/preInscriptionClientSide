import { z } from 'zod';
import { personalSchema } from './personalSchema';
import { contactSchema } from './contactSchema';
import { familySchema } from './familySchema';
import { professionalSchema } from './professionalSchema';
import { parentsSchema } from './parentsSchema';
import { guardianSchema } from './guardianSchema';
import { academicSchema } from './academicSchema';
import { diplomasSchema } from './diplomaSchema';

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
  });

export type PreRegistrationSchema = z.infer<typeof preRegistrationSchema>;
