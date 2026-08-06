import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const VARIANT_CLASSES: Record<NonNullable<LoadingButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-soft dark:shadow-soft-dark hover:shadow-soft-lg dark:hover:shadow-soft-lg-dark hover:from-primary-600 hover:to-primary-500',
  secondary:
    'bg-gradient-to-r from-secondary-500 to-secondary-400 text-white shadow-soft dark:shadow-soft-dark hover:shadow-soft-lg dark:hover:shadow-soft-lg-dark hover:from-secondary-400 hover:to-secondary-300',
  ghost: 'bg-white dark:bg-dark-card text-primary-700 dark:text-primary-400 border border-slate-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-dark-surface transition-colors duration-300',
};

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading, variant = 'primary', disabled, children, className = '', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
        {...rest}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  },
);

LoadingButton.displayName = 'LoadingButton';
