import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { GraduationCap, RefreshCw } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { FieldSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLevels } from '@/hooks/useLevels';
import { useCourses } from '@/hooks/useCourses';
import { getNiveauLabel } from '@/constants/niveauLabels';
import type { PreRegistrationFormValues } from '@/types';

export function AcademicStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const anneeAcademique = watch('AnneeAcademique');
  const selectedNiveau = watch('Niveau');
  const levelsQuery = useLevels(anneeAcademique);
  const coursesQuery = useCourses(anneeAcademique);

  const allCourses = coursesQuery.data ?? [];
  // Only filter by level when the API actually links courses to a level —
  // otherwise fall back to showing every course, so an unlinked payload never
  // hides valid options.
  const coursesAreLinkedToLevels = allCourses.some((course) => course.Niveau !== undefined);
  const availableCourses = coursesAreLinkedToLevels
    ? allCourses.filter((course) => course.Niveau === selectedNiveau)
    : allCourses;

  // Optimisation: useMemo pour ne pas recalculer les options à chaque rendu
  const levelOptions = useMemo(
    () => (levelsQuery.data ?? []).map((level) => ({
      value: level.Niveau,
      label: getNiveauLabel(level.Niveau),
    })),
    [levelsQuery.data]
  );

  const courseOptions = useMemo(
    () => availableCourses.map((course) => ({
      value: course.IDParcours,
      label: course.NomParcours,
    })),
    [availableCourses]
  );

  const selectedParcours = watch('IDParcours');
  useEffect(() => {
    if (!coursesAreLinkedToLevels) return;
    if (selectedParcours && !availableCourses.some((c) => c.IDParcours === selectedParcours)) {
      setValue('IDParcours', 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNiveau, coursesAreLinkedToLevels]);

  return (
    <FormLayout title="Choix académiques" description="Le niveau et le parcours que vous souhaitez intégrer.">
      <SectionCard icon={<GraduationCap className="h-5 w-5" />} title="Cursus visé">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Année académique" value={anneeAcademique} readOnly disabled hint="Sélectionnée automatiquement." />

          {levelsQuery.isLoading ? (
            <FieldSkeleton />
          ) : levelsQuery.isError ? (
            <div className="sm:col-span-1">
              <EmptyState
                title="Niveaux indisponibles"
                description={levelsQuery.error?.message}
                action={
                  <button
                    type="button"
                    onClick={() => levelsQuery.refetch()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Réessayer
                  </button>
                }
              />
            </div>
          ) : (
            <Select
              label="Niveau"
              required
              value={selectedNiveau || ''}
              options={levelOptions}
              error={errors.Niveau?.message}
              onChange={(event) => setValue('Niveau', Number(event.target.value), { shouldValidate: true })}
            />
          )}

          {coursesQuery.isLoading ? (
            <FieldSkeleton />
          ) : coursesQuery.isError ? (
            <div className="sm:col-span-1">
              <EmptyState
                title="Parcours indisponibles"
                description={coursesQuery.error?.message}
                action={
                  <button
                    type="button"
                    onClick={() => coursesQuery.refetch()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Réessayer
                  </button>
                }
              />
            </div>
          ) : (
            <Select
              label="Parcours"
              required
              value={selectedParcours || ''}
              options={courseOptions}
              placeholder={
                coursesAreLinkedToLevels && !selectedNiveau ? 'Choisissez d’abord un niveau' : 'Sélectionnez...'
              }
              error={errors.IDParcours?.message}
              onChange={(event) => setValue('IDParcours', Number(event.target.value), { shouldValidate: true })}
            />
          )}
        </div>
        <input type="hidden" {...register('AnneeAcademique')} />
      </SectionCard>
    </FormLayout>
  );
}
