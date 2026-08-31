import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
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

// Id du niveau "1ère année de Master" tel que renvoyé par l'API (ParcoursGet /
// AcademicStep) — cf. constants/niveauLabels.ts. C'est le référentiel réel du
// backend, distinct de la liste locale NIVEAU_DIPLOME_OPTIONS ci-dessous.
const MASTER_1_NIVEAU_ID = 4;

// Id "Licence 3" dans ce même référentiel réel du backend ("3ème année de
// Licence" dans constants/niveauLabels.ts). NIVEAU_DIPLOME_OPTIONS ne peut pas
// être utilisé ici : cette liste locale décale les valeurs (elle ajoute
// "Baccalauréat" en position 1, ce que le backend ne connaît pas), donc son
// "Licence 3" (value 4) collide en réalité avec "1ère année de Master" côté
// API et fait échouer l'enregistrement.
const LICENCE_3_NIVEAU_ID = 3;
const LICENCE_3_OPTION = { value: LICENCE_3_NIVEAU_ID, label: 'Licence 3' };

export function DiplomasStep() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const diplomas = useWatch({ control, name: 'diplomas' });
  const niveau = useWatch({ control, name: 'Niveau' });
  const isMasterEnrollment = niveau === MASTER_1_NIVEAU_ID;

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

  // La 2e carte diplôme (Licence 3) n'a de sens que pour une inscription en
  // 1ère année de Master, qui l'exige — elle apparaît/disparaît automatiquement
  // avec le niveau choisi à l'étape précédente, plutôt que d'être un ajout
  // manuel facultatif.
  useEffect(() => {
    if (isMasterEnrollment && diplomas.length < 2) {
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
            NiveauDiplome: LICENCE_3_NIVEAU_ID,
          },
        ],
        { shouldValidate: true },
      );
    } else if (!isMasterEnrollment && diplomas.length > 1) {
      setValue('diplomas', diplomas.slice(0, 1), { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMasterEnrollment]);

  const renderFields = (index: 0 | 1, lockNiveauToLicence3: boolean) => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {/* _localId n'est jamais affiché mais doit rester enregistré auprès de
          react-hook-form : sans ça, la ligne ajoutée dynamiquement (index 1)
          perd ce champ (et NiveauDiplome ci-dessous) dès que ses champs
          voisins s'enregistrent à leur tour, et Zod rejette la ligne entière
          ("expected string, received undefined") — bloquant Suivant. */}
      <input
        type="hidden"
        defaultValue={`diploma-${index}`}
        {...register(`diplomas.${index}._localId`)}
      />
      <Input
        label="Diplôme"
        required
        placeholder="Veuillez renseigner le nom du diplôme"
        error={errors.diplomas?.[index]?.Diplôme?.message}
        {...register(`diplomas.${index}.Diplôme`)}
      />
      {lockNiveauToLicence3 ? (
        <>
          {/* Même raison qu'au-dessus : ce champ doit être réellement
              enregistré pour survivre au montage tardif de la 2e carte —
              un <select disabled> sans `register` n'est qu'un affichage,
              pas une source de vérité pour react-hook-form. */}
          <input
            type="hidden"
            defaultValue={LICENCE_3_OPTION.value}
            {...register(`diplomas.${index}.NiveauDiplome`, { valueAsNumber: true })}
          />
          <Select
            label="Équivalence"
            required
            options={[LICENCE_3_OPTION]}
            value={LICENCE_3_OPTION.value}
            disabled
            onChange={() => {}}
          />
        </>
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

      {isMasterEnrollment && (
        <SectionCard
          icon={<Award className="h-5 w-5" />}
          title="Diplôme Licence 3 (Bac+3)"
          description="Requis pour une inscription en 1ère année de Master."
        >
          {renderFields(1, true)}
        </SectionCard>
      )}
    </FormLayout>
  );
}
