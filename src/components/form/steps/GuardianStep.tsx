import { useFormContext } from 'react-hook-form';
import { ShieldCheck } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RELATION_TUTEUR_OPTIONS } from '@/constants/options';
import type { PreRegistrationFormValues } from '@/types';

export function GuardianStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  return (
    <FormLayout title="Informations du tuteur" description="La personne à contacter en cas de besoin.">
      <SectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Tuteur légal">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Nom et prénom du tuteur"
            required
            error={errors.NomPrénomTuteur?.message}
            {...register('NomPrénomTuteur')}
          />
          <Select
            label="Relation avec le tuteur"
            required
            options={RELATION_TUTEUR_OPTIONS}
            error={errors.RelationAvecTuteur?.message}
            {...register('RelationAvecTuteur')}
          />
          <Input label="Fonction" error={errors.FonctionTuteur?.message} {...register('FonctionTuteur')} />
          <Input
            label="Lieu de travail"
            error={errors.LieuTravailTuteur?.message}
            {...register('LieuTravailTuteur')}
          />
          <Input label="Adresse" error={errors.AdresseTuteur?.message} {...register('AdresseTuteur')} />
          <Input
            label="Téléphone"
            required
            type="tel"
            error={errors.TéléphoneTuteur?.message}
            {...register('TéléphoneTuteur')}
          />
        </div>
      </SectionCard>
    </FormLayout>
  );
}
