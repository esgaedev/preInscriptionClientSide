import { useFormContext, Controller } from 'react-hook-form';
import { useMemo } from 'react';
import { Mail, MapPin, Phone, RefreshCw } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { FieldSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useArrondissements } from '@/hooks/useArrondissements';
import { NEIGHBORHOODS } from '@/constants/neighborhoods';
import type { PreRegistrationFormValues } from '@/types';

export function ContactStep() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const arrondissementId = watch('IDArrondissement');
  const arrondissementsQuery = useArrondissements();

  const arrondissementOptions = useMemo(
    () => (arrondissementsQuery.data ?? []).map((a) => ({
      value: a.IDArrondissement,
      label: a.DésignArrondissement,
    })),
    [arrondissementsQuery.data],
  );

  const neighborhoodOptions = useMemo(
    () => NEIGHBORHOODS.map((neighborhood) => ({ value: neighborhood, label: neighborhood })),
    [],
  );

  return (
    <FormLayout title="Coordonnées" description="Comment pouvons-nous vous joindre ?">
      <SectionCard icon={<Phone className="h-5 w-5" />} title="Contact">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Téléphone principal"
            required
            type="tel"
            icon={<Phone className="h-4 w-4" />}
            placeholder="Veuillez renseigner votre numéro de téléphone"
            hint="9 chiffres requis"
            error={errors.Téléphone1?.message}
            {...register('Téléphone1')}
          />
          <Input
            label="Téléphone secondaire"
            type="tel"
            icon={<Phone className="h-4 w-4" />}
            placeholder="Veuillez renseigner un numéro de téléphone secondaire"
            error={errors.Téléphone2?.message}
            {...register('Téléphone2')}
          />
          <Input
            label="Adresse e-mail"
            required
            type="email"
            icon={<Mail className="h-4 w-4" />}
            placeholder="Veuillez renseigner votre adresse e-mail"
            error={errors.Email?.message}
            {...register('Email')}
          />
        </div>
      </SectionCard>

      <SectionCard icon={<MapPin className="h-5 w-5" />} title="Adresse de résidence">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Adresse"
            required
            className="sm:col-span-2"
            placeholder="Veuillez renseigner votre adresse"
            error={errors.Adresse?.message}
            {...register('Adresse')}
          />
          <Controller
            control={control}
            name="Quartier"
            render={({ field }) => (
              <Autocomplete
                label="Quartier"
                required
                placeholder="Veuillez renseigner votre quartier"
                error={errors.Quartier?.message}
                value={field.value || ''}
                onChange={field.onChange}
                options={neighborhoodOptions}
                storageKey="quartier_history"
              />
            )}
          />

          {arrondissementsQuery.isLoading ? (
            <FieldSkeleton />
          ) : arrondissementsQuery.isError ? (
            <EmptyState
              title="Arrondissements indisponibles"
              description={arrondissementsQuery.error?.message}
              action={
                <button
                  type="button"
                  onClick={() => arrondissementsQuery.refetch()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Réessayer
                </button>
              }
            />
          ) : (
            <Select
              label="Arrondissement"
              required
              placeholder="Veuillez sélectionner votre arrondissement"
              value={arrondissementId || ''}
              options={arrondissementOptions}
              error={errors.IDArrondissement?.message}
              onChange={(event) =>
                setValue('IDArrondissement', Number(event.target.value), { shouldValidate: true })
              }
            />
          )}
        </div>
      </SectionCard>
    </FormLayout>
  );
}
