import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  id?: string;
  message?: string;
}

export function ErrorMessage({ id, message }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
