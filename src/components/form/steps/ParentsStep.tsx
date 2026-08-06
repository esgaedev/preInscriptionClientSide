import { useFormContext } from 'react-hook-form';
import { UserRound } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import type { PreRegistrationFormValues } from '@/types';

export function ParentsStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  const isOrphanFather = watch('OrphelinPère');
  const isOrphanMother = watch('OrphelinMère');

  return (
    <FormLayout title="Informations des parents" description="Renseignez les coordonnées de vos parents.">
      <SectionCard icon={<UserRound className="h-5 w-5" />} title="Père" description={isOrphanFather ? 'Marqué comme orphelin de père' : undefined}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Nom et prénom du père"
            required={!isOrphanFather}
            disabled={isOrphanFather}
            error={errors.NomPrenomPère?.message}
            {...register('NomPrenomPère')}
          />
          <Input label="Fonction" disabled={isOrphanFather} error={errors.FonctionPère?.message} {...register('FonctionPère')} />
          <Input
            label="Lieu de travail"
            disabled={isOrphanFather}
            error={errors.LieuTravailPère?.message}
            {...register('LieuTravailPère')}
          />
          <Input label="Adresse" disabled={isOrphanFather} error={errors.AdressePère?.message} {...register('AdressePère')} />
          <Input
            label="Téléphone"
            type="tel"
            disabled={isOrphanFather}
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
            disabled={isOrphanMother}
            error={errors.NomPrenomMère?.message}
            {...register('NomPrenomMère')}
          />
          <Input label="Fonction" disabled={isOrphanMother} error={errors.FonctionMère?.message} {...register('FonctionMère')} />
          <Input
            label="Lieu de travail"
            disabled={isOrphanMother}
            error={errors.LieuTravailMère?.message}
            {...register('LieuTravailMère')}
          />
          <Input label="Adresse" disabled={isOrphanMother} error={errors.AdresseMère?.message} {...register('AdresseMère')} />
          <Input
            label="Téléphone"
            type="tel"
            disabled={isOrphanMother}
            error={errors.TéléphoneMère?.message}
            {...register('TéléphoneMère')}
          />
        </div>
      </SectionCard>
    </FormLayout>
  );
}
