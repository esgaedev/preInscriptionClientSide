import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/services/courseService';
import { QUERY_KEYS } from '@/constants/api';

export function useCourses(anneeAcademique: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.courses(anneeAcademique ?? ''),
    queryFn: () => fetchCourses(anneeAcademique as string),
    enabled: Boolean(anneeAcademique),
  });
}
