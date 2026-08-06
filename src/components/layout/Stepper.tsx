import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { STEPS } from '@/constants/steps';

interface StepperProps {
  currentIndex: number;
  furthestIndex: number;
  onStepClick?: (index: number) => void;
}

export function Stepper({ currentIndex, furthestIndex, onStepClick }: StepperProps) {
  const progressPercent = (currentIndex / (STEPS.length - 1)) * 100;

  return (
    <nav aria-label="Progression de la pré-inscription">
      {/* Compact view (mobile) */}
      <div className="md:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-primary-700">
            Étape {currentIndex + 1} / {STEPS.length}
          </span>
          <span className="text-ink-soft/70">{STEPS[currentIndex].title}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary-800 to-primary-500"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Full stepper (tablet/desktop) */}
      <div className="scrollbar-thin hidden overflow-x-auto pb-2 md:block">
        <ol className="flex min-w-max items-center">
          {STEPS.map((step, index) => {
            const isCompleted = index < furthestIndex;
            const isCurrent = index === currentIndex;
            const isClickable = Boolean(onStepClick) && index <= furthestIndex;

            return (
              <li key={step.id} className="flex items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(index)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`group flex flex-col items-center gap-1.5 px-2 ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      isCurrent
                        ? 'border-secondary-500 bg-secondary-500 text-white shadow-soft'
                        : isCompleted
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span
                    className={`max-w-[6.5rem] text-center text-[11px] font-medium leading-tight ${
                      isCurrent ? 'text-primary-700' : 'text-ink-soft/60'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <span
                    className={`mx-1 h-0.5 w-8 shrink-0 rounded-full ${
                      index < furthestIndex ? 'bg-primary-500' : 'bg-slate-200'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
