import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ShieldCheck } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RadioGroup } from '@/components/ui/Radio';
import { RELATION_TUTEUR_OPTIONS } from '@/constants/options';
import type { PreRegistrationFormValues } from '@/types';

type TuteurSource = 'père' | 'mère' | 'moi-même' | 'autre';

const SOURCE_OPTIONS = [
  { value: 'père', label: 'Père' },
  { value: 'mère', label: 'Mère' },
  { value: 'moi-même', label: 'Moi-même' },
  { value: 'autre', label: 'Autre' },
];

function sourceFromRelation(relation: string): TuteurSource {
  if (relation === 'Père') return 'père';
  if (relation === 'Mère') return 'mère';
  if (relation === 'Moi-même') return 'moi-même';
  return 'autre';
}

export function GuardianStep() {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const [tuteurSource, setTuteurSource] = useState<TuteurSource>(() =>
    sourceFromRelation(getValues('RelationAvecTuteur')),
  );

  const isReadOnly = tuteurSource !== 'autre';

  const handleSourceChange = (value: string) => {
    const source = value as TuteurSource;
    setTuteurSource(source);

    if (source === 'père') {
      setValue('NomPrénomTuteur', getValues('NomPrenomPère'), { shouldValidate: true });
      setValue('FonctionTuteur', getValues('FonctionPère'));
      setValue('LieuTravailTuteur', getValues('LieuTravailPère'));
      setValue('AdresseTuteur', getValues('AdressePère'));
      setValue('TéléphoneTuteur', getValues('TéléphonePère'), { shouldValidate: true });
      setValue('RelationAvecTuteur', 'Père', { shouldValidate: true });
    } else if (source === 'mère') {
      setValue('NomPrénomTuteur', getValues('NomPrenomMère'), { shouldValidate: true });
      setValue('FonctionTuteur', getValues('FonctionMère'));
      setValue('LieuTravailTuteur', getValues('LieuTravailMère'));
      setValue('AdresseTuteur', getValues('AdresseMère'));
      setValue('TéléphoneTuteur', getValues('TéléphoneMère'), { shouldValidate: true });
      setValue('RelationAvecTuteur', 'Mère', { shouldValidate: true });
    } else if (source === 'moi-même') {
      setValue('NomPrénomTuteur', getValues('NomPrenom'), { shouldValidate: true });
      setValue('FonctionTuteur', '');
      setValue('LieuTravailTuteur', '');
      setValue('AdresseTuteur', getValues('Adresse'));
      setValue('TéléphoneTuteur', getValues('Téléphone1'), { shouldValidate: true });
      setValue('RelationAvecTuteur', 'Moi-même', { shouldValidate: true });
    } else {
      setValue('NomPrénomTuteur', '', { shouldValidate: true });
      setValue('FonctionTuteur', '');
      setValue('LieuTravailTuteur', '');
      setValue('AdresseTuteur', '');
      setValue('TéléphoneTuteur', '', { shouldValidate: true });
      setValue('RelationAvecTuteur', '', { shouldValidate: true });
    }
  };

  return (
    <FormLayout title="Informations du tuteur" description="La personne à contacter en cas de besoin.">
      <SectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Qui est votre tuteur légal ?">
        <RadioGroup
          label="Le tuteur légal est"
          name="tuteurSource"
          value={tuteurSource}
          onChange={handleSourceChange}
          options={SOURCE_OPTIONS}
        />
      </SectionCard>

      <SectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Tuteur légal">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Nom et prénom du tuteur"
            required
            readOnly={isReadOnly}
            placeholder="Veuillez renseigner le nom et prénom du tuteur"
            error={errors.NomPrénomTuteur?.message}
            {...register('NomPrénomTuteur')}
          />
          {tuteurSource === 'autre' ? (
            <Select
              label="Relation avec le tuteur"
              required
              placeholder="Veuillez sélectionner la relation avec le tuteur"
              options={RELATION_TUTEUR_OPTIONS}
              error={errors.RelationAvecTuteur?.message}
              {...register('RelationAvecTuteur')}
            />
          ) : (
            <Input label="Relation avec le tuteur" value={watch('RelationAvecTuteur')} readOnly />
          )}
          <Input
            label="Fonction"
            readOnly={isReadOnly}
            placeholder="Veuillez renseigner la fonction du tuteur"
            error={errors.FonctionTuteur?.message}
            {...register('FonctionTuteur')}
          />
          <Input
            label="Lieu de travail"
            readOnly={isReadOnly}
            placeholder="Veuillez renseigner le lieu de travail du tuteur"
            error={errors.LieuTravailTuteur?.message}
            {...register('LieuTravailTuteur')}
          />
          <Input
            label="Adresse"
            readOnly={isReadOnly}
            placeholder="Veuillez renseigner l’adresse du tuteur"
            error={errors.AdresseTuteur?.message}
            {...register('AdresseTuteur')}
          />
          <Input
            label="Téléphone"
            required
            type="tel"
            readOnly={isReadOnly}
            placeholder="Veuillez renseigner le téléphone du tuteur"
            error={errors.TéléphoneTuteur?.message}
            {...register('TéléphoneTuteur')}
          />
        </div>
      </SectionCard>
    </FormLayout>
  );
}
