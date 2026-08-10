import { useFormContext, Controller } from 'react-hook-form';
import { useMemo } from 'react';
import { User, MapPin, IdCard, RefreshCw } from 'lucide-react';
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
import { COUNTRY_OPTIONS } from '@/constants/countries';
import type { PreRegistrationFormValues } from '@/types';

// Fonction pour mettre en majuscules
const toUpperCase = (value: string) => value?.toUpperCase() || '';

// Fonction pour mettre la première lettre en majuscule et le reste en minuscule
const toTitleCase = (value: string) => {
  if (!value) return '';
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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

  const countryOptions = useMemo(
    () => COUNTRY_OPTIONS.map((country) => ({ value: country, label: country })),
    [],
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
            placeholder="Veuillez renseigner votre matricule"
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
            placeholder="Veuillez renseigner votre nom"
            error={errors.Nom?.message}
            {...register('Nom', {
              onChange: (e) => {
                e.target.value = toUpperCase(e.target.value);
              },
            })}
          />
          <Input
            label="Prénom"
            required
            icon={<User className="h-4 w-4" />}
            placeholder="Veuillez renseigner votre prénom"
            error={errors.Prenom?.message}
            {...register('Prenom', {
              onChange: (e) => {
                e.target.value = toTitleCase(e.target.value);
              },
            })}
          />
          <Controller
            control={control}
            name="DateNais"
            render={({ field }) => (
              <DatePicker
                label="Date de naissance"
                required
                hint="jj/mm/aaaa"
                error={errors.DateNais?.message}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Input
            label="Lieu de naissance"
            required
            icon={<MapPin className="h-4 w-4" />}
            placeholder="Veuillez renseigner votre lieu de naissance"
            error={errors.LieuNais?.message}
            {...register('LieuNais')}
          />
          <Select
            label="Pays d’origine"
            required
            placeholder="Veuillez sélectionner votre pays d’origine"
            options={countryOptions}
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
              placeholder="Veuillez sélectionner votre nationalité"
              value={nationaliteId || ''}
              options={nationalityOptions}
              error={errors.IDNationalité?.message}
              onChange={(event) => {
                const id = Number(event.target.value);
                const option = nationalitiesQuery.data?.find((n) => n.IDNationalité === id);
                setValue('IDNationalité', id, { shouldValidate: true });
                setValue('DésignNationalité', option?.DésignNationalité ?? '', { shouldValidate: true });
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
