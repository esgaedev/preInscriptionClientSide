import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import { LoadingButton } from '@/components/ui/LoadingButton';

interface DraftRestoreDialogProps {
  onContinue: () => void;
  onNewRegistration: () => void;
}

export function DraftRestoreDialog({ onContinue, onNewRegistration }: DraftRestoreDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl"
    >
      <SectionCard
        icon={<AlertCircle className="h-5 w-5" />}
        title="Une préinscription précédente a été trouvée"
      >
        <p className="text-sm text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">
          Nous avons détecté que vous aviez commencé une préinscription. Souhaitez-vous continuer
          là où vous vous étiez arrêté ou commencer une nouvelle préinscription ?
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <LoadingButton
            type="button"
            variant="secondary"
            onClick={onNewRegistration}
          >
            <RefreshCw className="h-4 w-4" />
            Nouvelle préinscription
          </LoadingButton>
          <LoadingButton
            type="button"
            onClick={onContinue}
          >
            Continuer mon inscription
            <ArrowRight className="h-4 w-4" />
          </LoadingButton>
        </div>
      </SectionCard>
    </motion.div>
  );
}
