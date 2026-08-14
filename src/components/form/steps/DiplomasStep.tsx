import { useFormContext, Controller } from 'react-hook-form';
import { useMemo } from 'react';
import { Award } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { MENTION_OPTIONS, NIVEAU_DIPLOME_OPTIONS } from '@/constants/options';
import { CONGO_CITIES } from '@/constants/congoCities';
import lycees from '@/data/lycees.json';
import type { PreRegistrationFormValues } from '@/types';

export function DiplomasStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const cityOptions = useMemo(
    () => CONGO_CITIES.map((city) => ({ value: city, label: city })),
    [],
  );

  const establishmentOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: { value: string; label: string }[] = [];
    for (const { nom } of lycees) {
      if (seen.has(nom)) continue;
      seen.add(nom);
      options.push({ value: nom, label: nom });
    }
    return options;
  }, []);

  return (
    <FormLayout title="Diplôme obtenu" description="Renseignez votre dernier diplôme obtenu.">
      <SectionCard icon={<Award className="h-5 w-5" />} title="Informations sur le diplôme">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Diplôme"
            required
            placeholder="Veuillez renseigner le nom du diplôme"
            error={errors.diplomas?.[0]?.Diplôme?.message}
            {...register('diplomas.0.Diplôme')}
          />
          <Select
            label="Équivalence"
            required
            placeholder="Veuillez sélectionner l’équivalence"
            options={NIVEAU_DIPLOME_OPTIONS}
            error={errors.diplomas?.[0]?.NiveauDiplome?.message}
            {...register('diplomas.0.NiveauDiplome', { valueAsNumber: true })}
          />
          <Select
            label="Mention"
            required
            placeholder="Veuillez sélectionner la mention"
            options={MENTION_OPTIONS}
            error={errors.diplomas?.[0]?.Mention?.message}
            {...register('diplomas.0.Mention')}
          />
          <Controller
            control={control}
            name="diplomas.0.Année"
            render={({ field }) => (
              <Input
                label="Année d'obtention"
                required
                type="number"
                placeholder="Veuillez renseigner l’année d’obtention"
                error={errors.diplomas?.[0]?.Année?.message}
                value={field.value || ''}
                onChange={(event) => field.onChange(event.target.value === '' ? 0 : Number(event.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="diplomas.0.ETS"
            render={({ field }) => (
              <Autocomplete
                label="Établissement d'obtention"
                required
                placeholder="Veuillez renseigner l'établissement d'obtention"
                error={errors.diplomas?.[0]?.ETS?.message}
                value={field.value || ''}
                onChange={field.onChange}
                options={establishmentOptions}
                storageKey="etablissement_history"
              />
            )}
          />
          <Controller
            control={control}
            name="diplomas.0.Lieu"
            render={({ field }) => (
              <Autocomplete
                label="Ville"
                required
                placeholder="Veuillez renseigner la ville d'obtention"
                error={errors.diplomas?.[0]?.Lieu?.message}
                value={field.value || ''}
                onChange={field.onChange}
                options={cityOptions}
                storageKey="ville_diplome_history"
              />
            )}
          />
        </div>
      </SectionCard>
    </FormLayout>
  );
}
