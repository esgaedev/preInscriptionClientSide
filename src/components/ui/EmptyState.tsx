import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-dark-border dark:bg-dark-surface/50 transition-colors duration-300">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-soft/40 shadow-sm dark:bg-dark-card dark:text-dark-text-secondary/40 dark:shadow-soft-dark transition-colors duration-300">
        {icon ?? <Inbox className="h-6 w-6" />}
      </span>
      <p className="text-sm font-medium text-ink dark:text-dark-text transition-colors duration-300">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs text-ink-soft/60 dark:text-dark-text-secondary/60 transition-colors duration-300">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
