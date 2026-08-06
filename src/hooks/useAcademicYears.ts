import { useQuery } from '@tanstack/react-query';
import { fetchDefaultAcademicYear } from '@/services/academicYearService';
import { QUERY_KEYS } from '@/constants/api';

/** Resolves the single academic year the whole form is bound to (auto-selected). */
export function useAcademicYears() {
  return useQuery({
    queryKey: QUERY_KEYS.academicYears,
    queryFn: fetchDefaultAcademicYear,
  });
}
