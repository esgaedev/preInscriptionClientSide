import { useFormContext } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { SECTEUR_ACTIVITE_OPTIONS, CATEGORIE_PRO_OPTIONS } from '@/constants/options';
import type { PreRegistrationFormValues } from '@/types';

export function ProfessionalStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const secteurActivité = watch('SecteurActivité');

  // Constante pour "Aucune activité"
  const NO_ACTIVITY_ID = 4;

  // Vérifie si l'utilisateur a une activité professionnelle (pas "Aucune activité")
  const hasActivity = secteurActivité !== NO_ACTIVITY_ID;

  return (
    <FormLayout title="Informations professionnelles" description="Votre activité professionnelle actuelle, le cas échéant.">
      <SectionCard icon={<Briefcase className="h-5 w-5" />} title="Activité">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            label="Secteur d’activité"
            required
            options={SECTEUR_ACTIVITE_OPTIONS}
            error={errors.SecteurActivité?.message}
            {...register('SecteurActivité', { valueAsNumber: true })}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Checkbox label="J’ai une expérience professionnelle" {...register('ExpérienceProf')} />
          <Checkbox label="J’ai créé mon entreprise" {...register('CréateurEntreprise')} />
        </div>

        <AnimatePresence initial={false}>
          {hasActivity && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <Input
                  label="Profession exercée"
                  required={hasActivity}
                  error={errors.ProfessionExercée?.message}
                  {...register('ProfessionExercée')}
                />
                <Input
                  label="Fonction actuelle"
                  required={hasActivity}
                  error={errors.FonctionActuelle?.message}
                  {...register('FonctionActuelle')}
                />
                <Input
                  label="Structure de travail"
                  required={hasActivity}
                  error={errors.StructureTravail?.message}
                  {...register('StructureTravail')}
                />
                <Select
                  label="Catégorie professionnelle"
                  required={hasActivity}
                  options={CATEGORIE_PRO_OPTIONS}
                  error={errors.CatégoriePro?.message}
                  {...register('CatégoriePro', { valueAsNumber: true })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>
    </FormLayout>
  );
}
