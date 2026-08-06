import { useFormContext } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CheckCircle2, Copy, Plus, SendHorizonal, ShieldAlert } from 'lucide-react';
import { FormLayout } from '@/components/form/FormLayout';
import { SectionCard } from '@/components/ui/SectionCard';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { useCreatePreRegistration } from '@/hooks/useCreatePreRegistration';
import { buildPreRegistrationPayload } from '@/utils/buildPreRegistrationPayload';
import { clearDraft } from '@/hooks/usePreRegistrationDraft';
import { DEFAULT_FORM_VALUES } from '@/constants/defaultFormValues';
import type { PreRegistrationFormValues } from '@/types';

export function ConfirmationStep() {
  const { getValues, reset } = useFormContext<PreRegistrationFormValues>();
  const navigate = useNavigate();
  const mutation = useCreatePreRegistration();

  const handleCopyPreMatricule = (preMatricule: string) => {
    navigator.clipboard.writeText(preMatricule).then(() => {
      toast.success('Pré-matricule copié !');
    }).catch(() => {
      toast.error('Erreur lors de la copie');
    });
  };

  const handleNewRegistration = () => {
    // Réinitialiser le formulaire avec les valeurs par défaut
    reset(DEFAULT_FORM_VALUES);
    // Nettoyer le localStorage
    localStorage.removeItem('esgai-charter-read');
    localStorage.removeItem('esgai-charter-accepted');
    clearDraft();
    // Naviguer vers la page d'accueil
    navigate('/');
  };

  const handleSubmit = () => {
    if (mutation.isPending) return;
    const payload = buildPreRegistrationPayload(getValues());
    mutation.mutate(payload, {
      onSuccess: () => {
        clearDraft();
        toast.success('Pré-inscription envoyée avec succès !');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (mutation.isSuccess) {
    const preMatricule = mutation.data.unstEtudiant.PreMatricule;

    return (
      <FormLayout title="Pré-inscription confirmée" description="">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center rounded-2xl border border-green-100 dark:border-green-900/30 bg-green-50/60 dark:bg-green-900/20 p-10 text-center shadow-soft dark:shadow-soft-dark transition-colors duration-300"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
            className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 transition-colors duration-300"
          >
            <CheckCircle2 className="h-10 w-10" />
          </motion.span>
          <h3 className="text-xl font-bold text-primary-700 dark:text-primary-400 transition-colors duration-300">Félicitations !</h3>
          <p className="mt-2 max-w-md text-sm text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">
            Votre dossier de pré-inscription à l'ESGAE a bien été enregistré. Conservez précieusement
            votre numéro de pré-matricule.
          </p>

          <div className="mt-6 rounded-2xl border-2 border-dashed border-primary-300 dark:border-primary-500 bg-white dark:bg-dark-card px-8 py-4 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/50 dark:text-dark-text-secondary/50 transition-colors duration-300">
                  Numéro de pré-matricule
                </p>
                <p className="mt-1 font-heading text-2xl font-extrabold text-primary-700 dark:text-primary-400 transition-colors duration-300">
                  {preMatricule}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyPreMatricule(preMatricule)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                title="Copier le pré-matricule"
              >
                <Copy className="h-4 w-4" />
                Copier
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LoadingButton
              type="button"
              variant="secondary"
              onClick={handleNewRegistration}
            >
              <Plus className="h-4 w-4" />
              Ajouter un nouveau préinscription
            </LoadingButton>
          </div>
        </motion.div>
      </FormLayout>
    );
  }

  return (
    <FormLayout title="Validation finale" description="Dernière étape avant l'envoi de votre dossier.">
      <SectionCard icon={<SendHorizonal className="h-5 w-5" />} title="Prêt à envoyer votre pré-inscription ?">
        <p className="text-sm text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">
          En cliquant sur « Envoyer ma pré-inscription », votre dossier sera transmis au service de la
          scolarité de l'ESGAE. Assurez-vous d'avoir vérifié toutes les informations dans le récapitulatif.
        </p>

        {mutation.isError && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3.5 text-sm text-red-700 dark:text-red-400 transition-colors duration-300">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{mutation.error.message}</span>
          </div>
        )}

        <div className="mt-6">
          <LoadingButton type="button" isLoading={mutation.isPending} onClick={handleSubmit}>
            <SendHorizonal className="h-4 w-4" />
            Envoyer ma pré-inscription
          </LoadingButton>
        </div>
      </SectionCard>
    </FormLayout>
  );
}