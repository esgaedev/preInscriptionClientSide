import { Loader2 } from 'lucide-react';

interface LoaderProps {
  label?: string;
}

export function Loader({ label = 'Chargement...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-ink-soft/60">
      <Loader2 className="h-6 w-6 animate-spin text-primary-500" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
