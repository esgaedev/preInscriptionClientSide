import { useFormContext } from 'react-hook-form';
import { Award } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MENTION_OPTIONS, NIVEAU_DIPLOME_OPTIONS } from '@/constants/options';
import type { PreRegistrationFormValues } from '@/types';

export function DiplomasStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  return (
    <FormLayout title="Diplôme obtenu" description="Renseignez votre dernier diplôme obtenu.">
      <SectionCard icon={<Award className="h-5 w-5" />} title="Informations sur le diplôme">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Diplôme"
            required
            placeholder="Ex : Licence en Informatique"
            error={errors.diplomas?.[0]?.Diplôme?.message}
            {...register('diplomas.0.Diplôme')}
          />
          <Select
            label="Équivalence"
            required
            options={NIVEAU_DIPLOME_OPTIONS}
            error={errors.diplomas?.[0]?.NiveauDiplome?.message}
            {...register('diplomas.0.NiveauDiplome', { valueAsNumber: true })}
          />
          <Select
            label="Mention"
            required
            options={MENTION_OPTIONS}
            error={errors.diplomas?.[0]?.Mention?.message}
            {...register('diplomas.0.Mention')}
          />
          <Input
            label="Année d'obtention"
            required
            type="number"
            placeholder="2024"
            error={errors.diplomas?.[0]?.Année?.message}
            {...register('diplomas.0.Année', { valueAsNumber: true })}
          />
          <Input
            label="Établissement d'obtention"
            required
            placeholder="Ex : Université Marien Ngouabi"
            error={errors.diplomas?.[0]?.ETS?.message}
            {...register('diplomas.0.ETS')}
          />
          <Input
            label="Ville"
            required
            placeholder="Ex : Brazzaville"
            error={errors.diplomas?.[0]?.Lieu?.message}
            {...register('diplomas.0.Lieu')}
          />
        </div>
      </SectionCard>
    </FormLayout>
  );
}
