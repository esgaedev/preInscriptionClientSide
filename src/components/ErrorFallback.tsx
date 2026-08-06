import { AlertTriangle, RotateCcw } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingButton';

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-8 w-8" />
      </span>
      <h1 className="text-xl font-bold text-primary-700">Une erreur inattendue est survenue</h1>
      <p className="mt-2 max-w-md text-sm text-ink-soft/70">
        {message || "Quelque chose s'est mal passé. Vous pouvez réessayer ou revenir plus tard."}
      </p>
      <LoadingButton onClick={resetErrorBoundary} className="mt-6">
        <RotateCcw className="h-4 w-4" />
        Réessayer
      </LoadingButton>
    </div>
  );
}
