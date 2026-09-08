import { QueryClient } from '@tanstack/react-query';
import type { ApiError } from '@/types';

// Doit être >= à la plus longue `staleTime` utilisée par un hook (voir
// useNationalities/useArrondissements/useAcademicYears/useCourses) et à
// `maxAge` du persister (src/api/persister.ts) : une entrée purgée du cache
// avant ce délai ne peut plus être ni servie depuis la mémoire, ni persistée
// dans localStorage.
export const REFERENCE_DATA_GC_TIME = 24 * 60 * 60 * 1000; // 24h

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const apiError = error as Partial<ApiError>;
        if (apiError.status && apiError.status >= 400 && apiError.status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: REFERENCE_DATA_GC_TIME,
    },
    mutations: {
      retry: false,
    },
  },
});
