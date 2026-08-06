import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Mirrors the shape of PreRegistrationPage (stepper + form card + nav
 * buttons) so the lazy-loaded route doesn't pop in behind a generic spinner.
 */
export function PreRegistrationSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12" aria-hidden="true">
      {/* Stepper */}
      <div className="mb-8 hidden items-center md:flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
            {i < 5 && <Skeleton className="mx-1 h-0.5 w-8 shrink-0 rounded-full" />}
          </div>
        ))}
      </div>
      <div className="mb-8 md:hidden">
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Step title */}
      <Skeleton className="mb-2 h-7 w-64" />
      <Skeleton className="mb-6 h-4 w-80" />

      {/* Form card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft dark:border-dark-border dark:bg-dark-card sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full">
              <Skeleton className="mb-1.5 h-3.5 w-24" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-dark-border">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}
