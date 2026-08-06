import { useCallback, useEffect } from 'react';
import type { PreRegistrationFormValues } from '@/types';

const STORAGE_KEY = 'esgae:pre-inscription:draft';

interface Draft {
  values: PreRegistrationFormValues;
  stepIndex: number;
  savedAt: string;
}

export function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Debounced auto-save of the wizard's progress so a refresh never loses data. */
export function usePreRegistrationDraft(
  values: PreRegistrationFormValues,
  stepIndex: number,
) {
  const save = useCallback((v: PreRegistrationFormValues, step: number) => {
    const draft: Draft = { values: v, stepIndex: step, savedAt: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage full or unavailable — progress simply won't persist across reloads.
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => save(values, stepIndex), 400);
    return () => clearTimeout(timeout);
  }, [values, stepIndex, save]);
}
