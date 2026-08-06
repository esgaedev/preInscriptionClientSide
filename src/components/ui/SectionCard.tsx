import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, description, icon, action, children, className = '' }: SectionCardProps) {
  return (
    <div className={`rounded-2xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card p-5 shadow-soft dark:shadow-soft-dark sm:p-6 transition-colors duration-300 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {icon && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-colors duration-300">
                {icon}
              </span>
            )}
            <div>
              {title && <h3 className="text-base font-semibold text-primary-700 dark:text-primary-400 transition-colors duration-300">{title}</h3>}
              {description && <p className="mt-0.5 text-sm text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">{description}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
