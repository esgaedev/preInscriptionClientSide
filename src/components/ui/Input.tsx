import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, required, id, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink dark:text-dark-text transition-colors duration-300">
          {label}
          {required && <span className="text-secondary-600 dark:text-secondary-400 ml-0.5">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60 dark:text-dark-text-secondary/60 transition-colors duration-300">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
            className={`w-full rounded-xl border bg-white dark:bg-dark-card px-4 py-2.5 text-sm text-ink dark:text-dark-text shadow-sm dark:shadow-soft-dark transition-all placeholder:text-slate-400 dark:placeholder:text-dark-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary-400/60 dark:focus:ring-primary-400/60 read-only:cursor-not-allowed read-only:bg-slate-100 read-only:text-ink-soft/70 dark:read-only:bg-dark-surface dark:read-only:text-dark-text-secondary/70 ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-red-400 focus:border-red-500 dark:border-red-500 dark:focus:border-red-600'
                : 'border-slate-200 dark:border-dark-border focus:border-primary-400 dark:focus:border-primary-500'
            } ${className}`}
            {...rest}
          />
        </div>
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">
            {hint}
          </p>
        )}
        <ErrorMessage id={errorId} message={error} />
      </div>
    );
  },
);

Input.displayName = 'Input';
