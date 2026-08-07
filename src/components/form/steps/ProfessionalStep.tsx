import { useFormContext } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { SECTEUR_ACTIVITE_OPTIONS, CATEGORIE_PRO_OPTIONS, NO_ACTIVITY_SECTOR_ID } from '@/constants/options';
import type { PreRegistrationFormValues } from '@/types';

export function ProfessionalStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const secteurActivité = watch('SecteurActivité');

  // Vérifie si l'utilisateur a une activité professionnelle (pas "Aucune activité")
  const hasActivity = secteurActivité !== NO_ACTIVITY_SECTOR_ID;

  return (
    <FormLayout title="Informations professionnelles" description="Votre activité professionnelle actuelle, le cas échéant.">
      <SectionCard icon={<Briefcase className="h-5 w-5" />} title="Activité">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            label="Secteur d’activité"
            required
            placeholder="Veuillez sélectionner votre secteur d’activité"
            options={SECTEUR_ACTIVITE_OPTIONS}
            error={errors.SecteurActivité?.message}
            {...register('SecteurActivité', { valueAsNumber: true })}
          />
          <Input
            label="Nombre d’années d’expérience professionnelle"
            type="number"
            min={0}
            max={99}
            placeholder="Veuillez renseigner votre nombre d’années d’expérience"
            hint="Au maximum 2 chiffres, ex : 20 an(s) d’expérience"
            error={errors.ExpérienceProf?.message}
            {...register('ExpérienceProf', { valueAsNumber: true })}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  placeholder="Veuillez renseigner votre profession exercée"
                  error={errors.ProfessionExercée?.message}
                  {...register('ProfessionExercée')}
                />
                <Input
                  label="Fonction actuelle"
                  required={hasActivity}
                  placeholder="Veuillez renseigner votre fonction actuelle"
                  error={errors.FonctionActuelle?.message}
                  {...register('FonctionActuelle')}
                />
                <Input
                  label="Structure de travail"
                  required={hasActivity}
                  placeholder="Veuillez renseigner votre structure de travail"
                  error={errors.StructureTravail?.message}
                  {...register('StructureTravail')}
                />
                <Select
                  label="Catégorie professionnelle"
                  required={hasActivity}
                  placeholder="Veuillez sélectionner votre catégorie professionnelle"
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
