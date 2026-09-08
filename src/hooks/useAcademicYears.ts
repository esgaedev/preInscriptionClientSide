import { useQuery } from '@tanstack/react-query';
import { fetchDefaultAcademicYear } from '@/services/academicYearService';
import { QUERY_KEYS } from '@/constants/api';

// Change rarement en cours d'année, mais peut être ajustée par un admin
// (dates d'inscription...) — on garde un délai plus court que les
// référentiels purement statiques (nationalités, arrondissements).
const STALE_TIME = 60 * 60 * 1000; // 1h

/** Resolves the single academic year the whole form is bound to (auto-selected). */
export function useAcademicYears() {
  return useQuery({
    queryKey: QUERY_KEYS.academicYears,
    queryFn: fetchDefaultAcademicYear,
    staleTime: STALE_TIME,
  });
}
