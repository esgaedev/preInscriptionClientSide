import { useFormContext, Controller } from 'react-hook-form';
import { useMemo } from 'react';
import { User, MapPin, Globe2, IdCard, RefreshCw } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Upload } from '@/components/ui/Upload';
import { RadioGroup } from '@/components/ui/Radio';
import { FieldSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNationalities } from '@/hooks/useNationalities';
import { getCountryFromNationality } from '@/utils/validation';
import type { PreRegistrationFormValues } from '@/types';

export function PersonalStep() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const nationaliteId = watch('IDNationalité');
  const nationalitiesQuery = useNationalities();

  // Optimisation: useMemo pour ne pas recalculer les options à chaque rendu
  const nationalityOptions = useMemo(
    () => (nationalitiesQuery.data ?? []).map((n) => ({
      value: n.IDNationalité,
      label: n.DésignNationalité,
    })),
    [nationalitiesQuery.data]
  );

  return (
    <FormLayout
      title="Informations personnelles"
      description="Renseignez votre identité telle qu’elle figure sur vos documents officiels."
    >
      <SectionCard icon={<IdCard className="h-5 w-5" />} title="Identité">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Matricule du baccalauréat"
            required
            placeholder="Ex : 1234567"
            error={errors.MatriculeBac?.message}
            {...register('MatriculeBac')}
          />
          <RadioGroup
            label="Sexe"
            name="Sexe"
            required
            value={watch('Sexe')}
            onChange={(value) => setValue('Sexe', value as 'M' | 'F', { shouldValidate: true })}
            options={[
              { value: 'M', label: 'Masculin' },
              { value: 'F', label: 'Féminin' },
            ]}
            error={errors.Sexe?.message}
          />
          <Input
            label="Nom"
            required
            icon={<User className="h-4 w-4" />}
            error={errors.Nom?.message}
            {...register('Nom')}
          />
          <Input
            label="Prénom"
            required
            icon={<User className="h-4 w-4" />}
            error={errors.Prenom?.message}
            {...register('Prenom')}
          />
          <DatePicker
            label="Date de naissance"
            required
            max={new Date().toISOString().slice(0, 10)}
            error={errors.DateNais?.message}
            {...register('DateNais')}
          />
          <Input
            label="Lieu de naissance"
            required
            icon={<MapPin className="h-4 w-4" />}
            error={errors.LieuNais?.message}
            {...register('LieuNais')}
          />
          <Input
            label="Pays d’origine"
            required
            icon={<Globe2 className="h-4 w-4" />}
            error={errors.PaysOrigine?.message}
            {...register('PaysOrigine')}
          />
          {nationalitiesQuery.isLoading ? (
            <FieldSkeleton />
          ) : nationalitiesQuery.isError ? (
            <EmptyState
              title="Nationalités indisponibles"
              description={nationalitiesQuery.error?.message}
              action={
                <button
                  type="button"
                  onClick={() => nationalitiesQuery.refetch()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Réessayer
                </button>
              }
            />
          ) : (
            <Select
              label="Nationalité"
              required
              value={nationaliteId || ''}
              options={nationalityOptions}
              error={errors.IDNationalité?.message}
              onChange={(event) => {
                const id = Number(event.target.value);
                const option = nationalitiesQuery.data?.find((n) => n.IDNationalité === id);
                setValue('IDNationalité', id, { shouldValidate: true });
                setValue('DésignNationalité', option?.DésignNationalité ?? '', { shouldValidate: true });
                // Auto-remplir le pays selon la nationalité
                const suggestedCountry = getCountryFromNationality(id);
                if (suggestedCountry) {
                  setValue('PaysOrigine', suggestedCountry, { shouldValidate: true });
                }
              }}
            />
          )}
        </div>
      </SectionCard>

      <SectionCard icon={<IdCard className="h-5 w-5" />} title="Photo d’identité" description="Optionnelle mais recommandée">
        <Controller
          control={control}
          name="Photo"
          render={({ field }) => (
            <Upload
              label="Photo"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={errors.Photo?.message}
              hint="Une photo récente et de bonne qualité, format portrait de préférence."
            />
          )}
        />
      </SectionCard>
    </FormLayout>
  );
}
