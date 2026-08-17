import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { useMemo } from 'react';
import { Award, Plus, X } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { MENTION_OPTIONS, NIVEAU_DIPLOME_OPTIONS } from '@/constants/options';
import { CONGO_CITIES } from '@/constants/congoCities';
import lycees from '@/data/lycees.json';
import type { PreRegistrationFormValues } from '@/types';

const LICENCE_3 = NIVEAU_DIPLOME_OPTIONS.find((option) => option.label === 'Licence 3')!;

export function DiplomasStep() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const diplomas = useWatch({ control, name: 'diplomas' });
  const hasSecondDiploma = diplomas.length > 1;

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

  const handleAddLicence3 = () => {
    setValue(
      'diplomas',
      [
        ...diplomas,
        {
          _localId: 'diploma-1',
          Diplôme: '',
          Mention: '',
          Année: 0,
          ETS: '',
          Lieu: '',
          NiveauDiplome: LICENCE_3.value,
        },
      ],
      { shouldValidate: true },
    );
  };

  const handleRemoveSecondDiploma = () => {
    setValue('diplomas', diplomas.slice(0, 1), { shouldValidate: true });
  };

  const renderFields = (index: 0 | 1, lockNiveauToLicence3: boolean) => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Input
        label="Diplôme"
        required
        placeholder="Veuillez renseigner le nom du diplôme"
        error={errors.diplomas?.[index]?.Diplôme?.message}
        {...register(`diplomas.${index}.Diplôme`)}
      />
      {lockNiveauToLicence3 ? (
        <Select
          label="Équivalence"
          required
          options={[LICENCE_3]}
          defaultValue={LICENCE_3.value}
          disabled
        />
      ) : (
        <Select
          label="Équivalence"
          required
          placeholder="Veuillez sélectionner l’équivalence"
          options={NIVEAU_DIPLOME_OPTIONS}
          error={errors.diplomas?.[index]?.NiveauDiplome?.message}
          {...register(`diplomas.${index}.NiveauDiplome`, { valueAsNumber: true })}
        />
      )}
      <Select
        label="Mention"
        required
        placeholder="Veuillez sélectionner la mention"
        options={MENTION_OPTIONS}
        error={errors.diplomas?.[index]?.Mention?.message}
        {...register(`diplomas.${index}.Mention`)}
      />
      <Controller
        control={control}
        name={`diplomas.${index}.Année`}
        render={({ field }) => (
          <Input
            label="Année d'obtention"
            required
            type="number"
            placeholder="Veuillez renseigner l’année d’obtention"
            error={errors.diplomas?.[index]?.Année?.message}
            value={field.value || ''}
            onChange={(event) => field.onChange(event.target.value === '' ? 0 : Number(event.target.value))}
            onBlur={field.onBlur}
          />
        )}
      />
      <Controller
        control={control}
        name={`diplomas.${index}.ETS`}
        render={({ field }) => (
          <Autocomplete
            label="Établissement d'obtention"
            required
            placeholder="Veuillez renseigner l'établissement d'obtention"
            error={errors.diplomas?.[index]?.ETS?.message}
            value={field.value || ''}
            onChange={field.onChange}
            options={establishmentOptions}
            storageKey="etablissement_history"
          />
        )}
      />
      <Controller
        control={control}
        name={`diplomas.${index}.Lieu`}
        render={({ field }) => (
          <Autocomplete
            label="Ville"
            required
            placeholder="Veuillez renseigner la ville d'obtention"
            error={errors.diplomas?.[index]?.Lieu?.message}
            value={field.value || ''}
            onChange={field.onChange}
            options={cityOptions}
            storageKey="ville_diplome_history"
          />
        )}
      />
    </div>
  );

  return (
    <FormLayout title="Diplôme obtenu" description="Renseignez votre dernier diplôme obtenu.">
      <SectionCard icon={<Award className="h-5 w-5" />} title="Informations sur le diplôme">
        {renderFields(0, false)}
      </SectionCard>

      {hasSecondDiploma ? (
        <SectionCard
          icon={<Award className="h-5 w-5" />}
          title="Diplôme Licence 3 (Bac+3)"
          description="À renseigner si vous possédez déjà une Licence 3."
          action={
            <button
              type="button"
              onClick={handleRemoveSecondDiploma}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Retirer
            </button>
          }
        >
          {renderFields(1, true)}
        </SectionCard>
      ) : (
        <button
          type="button"
          onClick={handleAddLicence3}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 dark:border-dark-border px-5 py-4 text-sm font-medium text-primary-600 dark:text-primary-400 transition-colors hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10"
        >
          <Plus className="h-4 w-4" /> Ajouter mon diplôme Licence 3 (Bac+3)
        </button>
      )}
    </FormLayout>
  );
}
