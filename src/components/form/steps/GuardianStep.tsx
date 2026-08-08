import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ShieldCheck } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RELATION_TUTEUR_OPTIONS } from '@/constants/options';
import type { PreRegistrationFormValues } from '@/types';

type TuteurSource = 'père' | 'mère' | 'moi-même' | 'autre';

const KNOWN_RELATIONS = RELATION_TUTEUR_OPTIONS.map((o) => o.value);

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

  const [tuteurSource] = useState<TuteurSource>(() =>
    sourceFromRelation(getValues('RelationAvecTuteur')),
  );

  // Choix sélectionné dans le champ "Relation avec le tuteur".
  // Distinct de la valeur réellement enregistrée dans le formulaire,
  // car "Autre" doit correspondre à la relation saisie manuellement.
  const [relationChoice, setRelationChoice] = useState(() => {
    const current = getValues('RelationAvecTuteur');

    return KNOWN_RELATIONS.includes(current)
      ? current
      : current
        ? 'Autre'
        : '';
  });

  const [customRelation, setCustomRelation] = useState(() => {
    const current = getValues('RelationAvecTuteur');

    return KNOWN_RELATIONS.includes(current)
      ? ''
      : current;
  });

  const isReadOnly = tuteurSource !== 'autre';

  // Lorsque le tuteur est le père ou la mère,
  // les informations professionnelles sont récupérées automatiquement.
  const isWorkInfoReadOnly =
    tuteurSource === 'père' || tuteurSource === 'mère';

  // Pour "moi-même", vérifier si les informations professionnelles
  // sont déjà renseignées.
  const fonctionActuelle = watch('FonctionActuelle');
  const structureTravail = watch('StructureTravail');

  // Boolean() garantit que cette variable est toujours un boolean.
  const hasProfessionalInfo = Boolean(
    fonctionActuelle?.trim() || structureTravail?.trim(),
  );

  const isWorkInfoReadOnlyForSelf =
    tuteurSource === 'moi-même' && hasProfessionalInfo;

  // Mettre automatiquement à jour les informations professionnelles
  // du tuteur lorsque le tuteur est "moi-même".
  useEffect(() => {
    if (tuteurSource === 'moi-même') {
      setValue(
        'FonctionTuteur',
        fonctionActuelle || '',
      );

      setValue(
        'LieuTravailTuteur',
        structureTravail || '',
      );
    }
  }, [
    fonctionActuelle,
    structureTravail,
    tuteurSource,
    setValue,
  ]);

  const handleRelationChoiceChange = (choice: string) => {
    setRelationChoice(choice);

    if (choice === 'Autre') {
      setValue(
        'RelationAvecTuteur',
        customRelation,
        { shouldValidate: true },
      );
    } else {
      setCustomRelation('');

      setValue(
        'RelationAvecTuteur',
        choice,
        { shouldValidate: true },
      );
    }
  };

  const handleCustomRelationChange = (text: string) => {
    setCustomRelation(text);

    setValue(
      'RelationAvecTuteur',
      text,
      { shouldValidate: true },
    );
  };

  return (
    <FormLayout title="Qui est votre tuteur légal ?">
      <SectionCard
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Tuteur légal"
      >
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
            <div className="grid grid-cols-1 gap-5 sm:col-span-1">
              <Select
                label="Relation avec le tuteur"
                required
                placeholder="Veuillez sélectionner la relation avec le tuteur"
                options={RELATION_TUTEUR_OPTIONS}
                value={relationChoice}
                error={errors.RelationAvecTuteur?.message}
                onChange={(event) =>
                  handleRelationChoiceChange(
                    event.target.value,
                  )
                }
              />

              {relationChoice === 'Autre' && (
                <Input
                  label="Précisez la relation"
                  required
                  placeholder="Veuillez préciser la relation avec le tuteur"
                  value={customRelation}
                  onChange={(event) =>
                    handleCustomRelationChange(
                      event.target.value,
                    )
                  }
                />
              )}
            </div>
          ) : (
            <Input
              label="Relation avec le tuteur"
              value={watch('RelationAvecTuteur')}
              readOnly
            />
          )}

          <Input
            label="Fonction"
            readOnly={
              isWorkInfoReadOnly ||
              isWorkInfoReadOnlyForSelf
            }
            placeholder="Veuillez renseigner la fonction du tuteur"
            error={errors.FonctionTuteur?.message}
            {...register('FonctionTuteur')}
          />

          <Input
            label="Lieu de travail"
            readOnly={
              isWorkInfoReadOnly ||
              isWorkInfoReadOnlyForSelf
            }
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
