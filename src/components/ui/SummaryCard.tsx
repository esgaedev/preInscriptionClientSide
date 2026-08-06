import type { ReactNode } from 'react';
import { Pencil } from 'lucide-react';

export interface SummaryField {
  label: string;
  value: ReactNode;
}

interface SummaryCardProps {
  title: string;
  icon?: ReactNode;
  fields: SummaryField[];
  onEdit?: () => void;
}

export function SummaryCard({ title, icon, fields, onEdit }: SummaryCardProps) {
  const filled = fields.filter((f) => f.value !== '' && f.value !== undefined && f.value !== null);

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card p-5 shadow-soft dark:shadow-soft-dark sm:p-6 transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-primary-600 dark:text-primary-400 transition-colors duration-300">{icon}</span>}
          <h3 className="text-base font-semibold text-primary-700 dark:text-primary-400 transition-colors duration-300">{title}</h3>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </button>
        )}
      </div>

      {filled.length === 0 ? (
        <p className="text-sm italic text-ink-soft/50 dark:text-dark-text-secondary/50 transition-colors duration-300">Aucune information renseignée.</p>
      ) : (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {filled.map((field) => (
            <div key={field.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft/50 dark:text-dark-text-secondary/50 transition-colors duration-300">
                {field.label}
              </dt>
              <dd className="mt-0.5 text-sm text-ink dark:text-dark-text transition-colors duration-300">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
