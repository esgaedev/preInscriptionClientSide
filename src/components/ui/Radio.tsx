import { useId } from 'react';
import { ErrorMessage } from './ErrorMessage';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  required?: boolean;
}

export function RadioGroup({ label, name, value, onChange, options, error, required }: RadioGroupProps) {
  const groupId = useId();
  const errorId = error ? `${groupId}-error` : undefined;

  return (
    <div role="radiogroup" aria-labelledby={`${groupId}-label`} aria-describedby={errorId}>
      <span id={`${groupId}-label`} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-secondary-600 ml-0.5">*</span>}
      </span>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const inputId = `${groupId}-${option.value}`;
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                checked
                  ? 'border-primary-500 bg-primary-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-ink hover:border-primary-300'
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      <ErrorMessage id={errorId} message={error} />
    </div>
  );
}
