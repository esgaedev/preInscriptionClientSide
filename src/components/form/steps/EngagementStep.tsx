import { useFormContext } from 'react-hook-form';
import { FormLayout } from '@/components/form/FormLayout';
import { EngagementForm } from '@/components/ui/EngagementForm';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useState } from 'react';
import type { PreRegistrationFormValues } from '@/types';

interface EngagementStepProps {
  onNext?: () => void;
  onPrev?: () => void;
}

const CHARTER_ACCEPTED_KEY = 'esgai-charter-accepted';

export function EngagementStep({ onNext, onPrev }: EngagementStepProps) {
  const { watch } = useFormContext<PreRegistrationFormValues>();
  const nom = watch('Nom');
  const prenom = watch('Prenom');
  const studentName = `${prenom} ${nom}`.trim();
  
  // État local pour savoir si la case est cochée — lu de façon synchrone dès
  // l'initialisation pour éviter un flash "non coché" au (re)montage du composant
  // (ex: après un aller-retour vers une autre étape).
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(
    () => localStorage.getItem(CHARTER_ACCEPTED_KEY) === 'true',
  );

  const handleAccept = () => {
    onNext?.();
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsCheckboxChecked(checked);
    // Mettre à jour localStorage
    localStorage.setItem(CHARTER_ACCEPTED_KEY, String(checked));
  };

  return (
    <FormLayout 
      title="Charte d'engagement" 
      description="Veuillez lire attentivement et accepter la charte d'engagement de l'étudiant."
    >
      <EngagementForm
        studentName={studentName}
        onAccept={handleAccept}
        onCheckboxChange={handleCheckboxChange}
        acceptButtonText="J'accepte et je continue"
        showAcceptButton={!isCheckboxChecked}
      />
      
      {/* Boutons de navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-dark-border">
        <LoadingButton
          type="button"
          variant="ghost"
          onClick={onPrev}
        >
          Précédent
        </LoadingButton>
        
        {isCheckboxChecked && (
          <LoadingButton
            type="button"
            onClick={onNext}
          >
            Suivant
          </LoadingButton>
        )}
      </div>
    </FormLayout>
  );
}