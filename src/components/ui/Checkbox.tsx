import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, id, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={`flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card p-3.5 transition-colors hover:border-primary-300 dark:hover:border-primary-500 has-[:checked]:border-primary-400 dark:has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/30 ${className}`}
      >
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <input ref={ref} id={checkboxId} type="checkbox" className="peer sr-only" {...rest} />
          <span className="h-5 w-5 rounded-md border-2 border-slate-300 dark:border-dark-surface transition-colors peer-checked:border-primary-600 dark:peer-checked:border-primary-400 peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500 peer-focus-visible:ring-2 peer-focus-visible:ring-secondary-400/60 dark:peer-focus-visible:ring-primary-400/60" />
          <Check className="pointer-events-none absolute h-3.5 w-3.5 scale-0 text-white transition-transform peer-checked:scale-100" />
        </span>
        <span>
          <span className="block text-sm font-medium text-ink dark:text-dark-text transition-colors duration-300">{label}</span>
          {description && <span className="mt-0.5 block text-xs text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">{description}</span>}
        </span>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
