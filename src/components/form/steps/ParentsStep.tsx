import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { UserRound } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { PROFESSIONS } from '@/constants/professions';
import type { PreRegistrationFormValues } from '@/types';

// Met en majuscule uniquement la toute première lettre saisie — le reste du
// texte n'est jamais réécrit, pour laisser l'utilisateur taper librement
// (casse mixte, majuscules verrouillées, etc.) sans que chaque frappe
// n'efface ce qu'il vient de saisir.
const capitalizeFirstLetter = (value: string) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function ParentsStep() {
  const {
    register,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const isOrphanFather = watch('OrphelinPère');
  const isOrphanMother = watch('OrphelinMère');

  const professionOptions = useMemo(
    () => PROFESSIONS.map((profession) => ({ value: profession, label: profession })),
    [],
  );

  // Pré-remplit le nom du père avec celui de l'étudiant (surnom de famille
  // partagé la plupart du temps) — une seule fois, à l'arrivée sur l'étape,
  // et seulement si le champ est encore vide (ne jamais écraser une saisie
  // existante). Le champ reste ensuite un input normal, librement modifiable.
  useEffect(() => {
    if (!getValues('NomPrenomPère')) {
      setValue('NomPrenomPère', getValues('Nom'));
    }
    // Pré-remplit l'adresse des parents avec celle de l'étudiant
    const studentAddress = getValues('Adresse');
    if (studentAddress && !getValues('AdressePère')) {
      setValue('AdressePère', studentAddress);
    }
    if (studentAddress && !getValues('AdresseMère')) {
      setValue('AdresseMère', studentAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormLayout title="Informations des parents" description="Renseignez les coordonnées de vos parents.">
      <SectionCard icon={<UserRound className="h-5 w-5" />} title="Père" description={isOrphanFather ? 'Marqué comme orphelin de père' : undefined}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Nom et prénom du père"
            required={!isOrphanFather}
            placeholder="Veuillez renseigner le nom et prénom du père"
            error={errors.NomPrenomPère?.message}
            {...register('NomPrenomPère', {
              onChange: (e) => {
                e.target.value = capitalizeFirstLetter(e.target.value);
              },
            })}
          />
          <Autocomplete
            label="Fonction"
            placeholder="Veuillez renseigner la fonction du père"
            error={errors.FonctionPère?.message}
            value={watch('FonctionPère') || ''}
            onChange={(value) => setValue('FonctionPère', value)}
            options={professionOptions}
            storageKey="fonction_history"
          />
          <Autocomplete
            label="Lieu de travail"
            placeholder="Veuillez renseigner le lieu de travail du père"
            error={errors.LieuTravailPère?.message}
            value={watch('LieuTravailPère') || ''}
            onChange={(value) => setValue('LieuTravailPère', value)}
            storageKey="lieu_travail_history"
          />
          <Input
            label="Adresse"
            placeholder="Veuillez renseigner l'adresse du père"
            error={errors.AdressePère?.message}
            {...register('AdressePère')}
          />
          <Input
            label="Téléphone"
            type="tel"
            placeholder="Veuillez renseigner le téléphone du père"
            error={errors.TéléphonePère?.message}
            {...register('TéléphonePère')}
          />
        </div>
      </SectionCard>

      <SectionCard icon={<UserRound className="h-5 w-5" />} title="Mère" description={isOrphanMother ? 'Marquée comme orpheline de mère' : undefined}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Nom et prénom de la mère"
            required={!isOrphanMother}
            placeholder="Veuillez renseigner le nom et prénom de la mère"
            error={errors.NomPrenomMère?.message}
            {...register('NomPrenomMère', {
              onChange: (e) => {
                e.target.value = capitalizeFirstLetter(e.target.value);
              },
            })}
          />
          <Autocomplete
            label="Fonction"
            placeholder="Veuillez renseigner la fonction de la mère"
            error={errors.FonctionMère?.message}
            value={watch('FonctionMère') || ''}
            onChange={(value) => setValue('FonctionMère', value)}
            options={professionOptions}
            storageKey="fonction_history"
          />
          <Autocomplete
            label="Lieu de travail"
            placeholder="Veuillez renseigner le lieu de travail de la mère"
            error={errors.LieuTravailMère?.message}
            value={watch('LieuTravailMère') || ''}
            onChange={(value) => setValue('LieuTravailMère', value)}
            storageKey="lieu_travail_history"
          />
          <Input
            label="Adresse"
            placeholder="Veuillez renseigner l'adresse de la mère"
            error={errors.AdresseMère?.message}
            {...register('AdresseMère')}
          />
          <Input
            label="Téléphone"
            type="tel"
            placeholder="Veuillez renseigner le téléphone de la mère"
            error={errors.TéléphoneMère?.message}
            {...register('TéléphoneMère')}
          />
        </div>
      </SectionCard>
    </FormLayout>
  );
}
