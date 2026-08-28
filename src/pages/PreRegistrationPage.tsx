import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, RefreshCw, WifiOff, RotateCcw } from 'lucide-react';

import { Stepper } from '@/components/layout/Stepper';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { PersonalStep } from '@/components/form/steps/PersonalStep';
import { ContactStep } from '@/components/form/steps/ContactStep';
import { FamilyStep } from '@/components/form/steps/FamilyStep';
import { ProfessionalStep } from '@/components/form/steps/ProfessionalStep';
import { ParentsStep } from '@/components/form/steps/ParentsStep';
import { GuardianStep } from '@/components/form/steps/GuardianStep';
import { AcademicStep } from '@/components/form/steps/AcademicStep';
import { DiplomasStep } from '@/components/form/steps/DiplomasStep';
import { EngagementStep } from '@/components/form/steps/EngagementStep';
import { SummaryStep } from '@/components/form/steps/SummaryStep';
import { ConfirmationStep } from '@/components/form/steps/ConfirmationStep';
import { DraftRestoreDialog } from '@/components/form/DraftRestoreDialog';

import { useAcademicYears } from '@/hooks/useAcademicYears';
import { usePreRegistrationDraft, readDraft, clearDraft } from '@/hooks/usePreRegistrationDraft';
import { preRegistrationSchema } from '@/validators/preRegistrationSchema';
import { STEP_FIELDS } from '@/validators/stepFields';
import { STEPS } from '@/constants/steps';
import { DEFAULT_FORM_VALUES } from '@/constants/defaultFormValues';
import type { PreRegistrationFormValues, StepId } from '@/types';

export function PreRegistrationPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<any>(null);
  const hasCheckedDraft = useRef(false);

  const methods = useForm<PreRegistrationFormValues>({
    resolver: zodResolver(preRegistrationSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onTouched',
  });
  const { control, trigger, setValue, getValues, reset } = methods;

  const academicYearQuery = useAcademicYears();

  // Check for draft on mount, but don't auto-restore
  useEffect(() => {
    if (hasCheckedDraft.current) return;
    hasCheckedDraft.current = true;
    const draft = readDraft();
    const hasMeaningfulProgress =
      draft && (draft.stepIndex > 0 || JSON.stringify(draft.values) !== JSON.stringify(DEFAULT_FORM_VALUES));
    if (draft && hasMeaningfulProgress) {
      setPendingDraft(draft);
      setShowDraftDialog(true);
    }
  }, []);

  // Auto-select the (only) academic year, without ever letting the user pick it.
  useEffect(() => {
    if (academicYearQuery.data && !getValues('AnneeAcademique')) {
      setValue('AnneeAcademique', academicYearQuery.data);
    }
  }, [academicYearQuery.data, getValues, setValue]);

  // Keep the API's `NomPrenom` field in sync without exposing it as its own input.
  const nom = useWatch({ control, name: 'Nom' });
  const prenom = useWatch({ control, name: 'Prenom' });
  useEffect(() => {
    setValue('NomPrenom', [prenom, nom].filter(Boolean).join(' ').trim());
  }, [nom, prenom, setValue]);

  const watchedValues = useWatch({ control });
  usePreRegistrationDraft(watchedValues as PreRegistrationFormValues, stepIndex);

  const currentStep = STEPS[stepIndex];

  const handleContinueDraft = () => {
    if (pendingDraft) {
      reset(pendingDraft.values);
      setStepIndex(pendingDraft.stepIndex);
      setFurthestIndex(pendingDraft.stepIndex);
      setShowDraftDialog(false);
      setPendingDraft(null);
      toast.info('Votre progression précédente a été restaurée.');
    }
  };

  const handleNewRegistration = () => {
    clearDraft();
    reset(DEFAULT_FORM_VALUES);
    setStepIndex(0);
    setFurthestIndex(0);
    setShowDraftDialog(false);
    setPendingDraft(null);
    toast.success('Nouvelle préinscription démarrée.');
  };

  const handleRestart = () => {
    if (confirm('Recommencer la préinscription ?\n\nLes informations actuellement saisies seront supprimées et vous devrez recommencer depuis le début.')) {
      clearDraft();
      reset(DEFAULT_FORM_VALUES);
      setStepIndex(0);
      setFurthestIndex(0);
      toast.success('Formulaire réinitialisé.');
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepIndex]);

  async function goNext() {
    if (currentStep.id === 'summary') {
      const valid = await trigger();
      if (!valid) {
        toast.error('Certaines informations sont invalides. Vérifiez les étapes précédentes.');
        return;
      }
    } else {
      const fields = STEP_FIELDS[currentStep.id];
      const valid = fields ? await trigger(fields) : true;
      if (!valid) {
        toast.error('Veuillez corriger les champs en erreur avant de continuer.');
        return;
      }
    }
    const next = Math.min(stepIndex + 1, STEPS.length - 1);
    setStepIndex(next);
    setFurthestIndex((f) => Math.max(f, next));
  }

  function goPrev() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function goToStepIndex(index: number) {
    if (index <= furthestIndex) setStepIndex(index);
  }

  function goToStepId(id: StepId) {
    const index = STEPS.findIndex((s) => s.id === id);
    if (index >= 0) {
      setFurthestIndex((f) => Math.max(f, index));
      setStepIndex(index);
    }
  }

  const isFirstStep = stepIndex === 0;
  const isConfirmationStep = currentStep.id === 'confirmation';
  const isEngagementStep = currentStep.id === 'engagement';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <FormProvider {...methods}>
        {showDraftDialog ? (
          <DraftRestoreDialog
            onContinue={handleContinueDraft}
            onNewRegistration={handleNewRegistration}
          />
        ) : (
          <>
            <div className="mb-8">
              <Stepper currentIndex={stepIndex} furthestIndex={furthestIndex} onStepClick={goToStepIndex} />
            </div>

            {academicYearQuery.isError && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200 transition-colors duration-300">
                <WifiOff className="h-4 w-4 shrink-0" />
                <span className="flex-1">
                  Impossible de récupérer l'année académique en cours. Certaines étapes peuvent être indisponibles.
                </span>
                <button
                  type="button"
                  onClick={() => academicYearQuery.refetch()}
                  className="inline-flex items-center gap-1.5 font-medium underline dark:text-amber-300 hover:dark:text-amber-200 transition-colors duration-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Réessayer
                </button>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                <motion.div key={currentStep.id}>
                  {currentStep.id === 'personal' && <PersonalStep />}
                  {currentStep.id === 'contact' && <ContactStep />}
                  {currentStep.id === 'family' && <FamilyStep />}
                  {currentStep.id === 'professional' && <ProfessionalStep />}
                  {currentStep.id === 'parents' && <ParentsStep />}
                  {currentStep.id === 'guardian' && <GuardianStep />}
                  {currentStep.id === 'academic' && <AcademicStep />}
                  {currentStep.id === 'diplomas' && <DiplomasStep />}
                  {currentStep.id === 'engagement' && <EngagementStep onNext={goNext} onPrev={goPrev} />}
                  {currentStep.id === 'summary' && <SummaryStep onEditStep={goToStepId} />}
                  {currentStep.id === 'confirmation' && <ConfirmationStep />}
                </motion.div>
              </AnimatePresence>

              {!isConfirmationStep && !isEngagementStep && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2">
                    <LoadingButton type="button" variant="ghost" onClick={goPrev} disabled={isFirstStep}>
                      <ArrowLeft className="h-4 w-4" />
                      Précédent
                    </LoadingButton>
                    {!isFirstStep && (
                      <LoadingButton
                        type="button"
                        variant="ghost"
                        onClick={handleRestart}
                        className="text-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Recommencer
                      </LoadingButton>
                    )}
                  </div>
                  <LoadingButton type="button" onClick={goNext}>
                    {currentStep.id === 'summary' ? 'Confirmer et continuer' : 'Suivant'}
                    <ArrowRight className="h-4 w-4" />
                  </LoadingButton>
                </div>
              )}
            </form>
          </>
        )}
      </FormProvider>
    </div>
  );
}
