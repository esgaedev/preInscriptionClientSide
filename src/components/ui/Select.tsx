import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';

export interface SelectOptionItem {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOptionItem[];
  placeholder?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder = 'Sélectionnez...', required, id, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="w-full">
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink dark:text-dark-text transition-colors duration-300">
          {label}
          {required && <span className="text-secondary-600 dark:text-secondary-400 ml-0.5">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className={`w-full appearance-none rounded-xl border bg-white dark:bg-dark-card px-4 py-2.5 pr-10 text-sm text-ink dark:text-dark-text shadow-sm dark:shadow-soft-dark transition-all focus:outline-none focus:ring-2 focus:ring-secondary-400/60 dark:focus:ring-primary-400/60 ${
              error
                ? 'border-red-400 focus:border-red-500 dark:border-red-500 dark:focus:border-red-600'
                : 'border-slate-200 dark:border-dark-border focus:border-primary-400 dark:focus:border-primary-500'
            } ${className}`}
            {...rest}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/60 dark:text-dark-text-secondary/60 transition-colors duration-300"
            aria-hidden="true"
          />
        </div>
        <ErrorMessage id={errorId} message={error} />
      </div>
    );
  },
);

Select.displayName = 'Select';
