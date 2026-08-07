import { useFormContext } from 'react-hook-form';
import { HeartHandshake, Users } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { SITUATION_MATRIMONIALE_OPTIONS } from '@/constants/options';
import type { PreRegistrationFormValues } from '@/types';

export function FamilyStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const sexe = watch('Sexe');

  return (
    <FormLayout title="Situation familiale" description="Ces informations nous aident à mieux vous accompagner.">
      <SectionCard icon={<Users className="h-5 w-5" />} title="Situation matrimoniale">
        <div className="max-w-sm">
          <Select
            label="Situation matrimoniale"
            required
            placeholder="Veuillez sélectionner votre situation matrimoniale"
            options={SITUATION_MATRIMONIALE_OPTIONS}
            error={errors.SituationMatrimoniale?.message}
            {...register('SituationMatrimoniale', { valueAsNumber: true })}
          />
        </div>
      </SectionCard>

      <SectionCard icon={<HeartHandshake className="h-5 w-5" />} title="Particularités">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Checkbox label="Orphelin de père" {...register('OrphelinPère')} />
          <Checkbox label="Orpheline de mère" {...register('OrphelinMère')} />
          {sexe === 'F' && <Checkbox label="Fille-mère" {...register('FilleMère')} />}
          <Checkbox label="Autochtone" {...register('Autochtone')} />
          <Checkbox label="Personne en situation de handicap" {...register('Handicapé')} />
          <Checkbox label="Boursier(ère)" description="Bénéficiaire d’une bourse" {...register('Boursier')} />
        </div>
      </SectionCard>
    </FormLayout>
  );
}
