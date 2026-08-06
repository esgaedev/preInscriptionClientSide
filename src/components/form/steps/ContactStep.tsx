import { useFormContext } from 'react-hook-form';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { Input } from '@/components/ui/Input';
import type { PreRegistrationFormValues } from '@/types';

export function ContactStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PreRegistrationFormValues>();

  return (
    <FormLayout title="Coordonnées" description="Comment pouvons-nous vous joindre ?">
      <SectionCard icon={<Phone className="h-5 w-5" />} title="Contact">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Téléphone principal"
            required
            type="tel"
            icon={<Phone className="h-4 w-4" />}
            placeholder="9 chiffres (ex: 012345678)"
            hint="9 chiffres requis"
            error={errors.Téléphone1?.message}
            {...register('Téléphone1')}
          />
          <Input
            label="Téléphone secondaire"
            type="tel"
            icon={<Phone className="h-4 w-4" />}
            placeholder="9 chiffres (ex: 012345678)"
            error={errors.Téléphone2?.message}
            {...register('Téléphone2')}
          />
          <Input
            label="Adresse e-mail"
            required
            type="email"
            icon={<Mail className="h-4 w-4" />}
            placeholder="vous@exemple.com"
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
            error={errors.Adresse?.message}
            {...register('Adresse')}
          />
          <Input label="Quartier" required error={errors.Quartier?.message} {...register('Quartier')} />
          <Input
            label="Arrondissement (code)"
            type="number"
            min="1"
            max="10"
            hint="Code entre 1 et 10"
            error={errors.IDArrondissement?.message}
            {...register('IDArrondissement', { valueAsNumber: true })}
          />
        </div>
      </SectionCard>
    </FormLayout>
  );
}
