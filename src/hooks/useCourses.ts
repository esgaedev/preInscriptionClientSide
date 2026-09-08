import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/services/courseService';
import { QUERY_KEYS } from '@/constants/api';

// La liste des parcours d'une année donnée peut évoluer (ajout/retrait d'un
// parcours) mais pas d'une minute à l'autre — évite de la rappeler à chaque
// montage de l'étape académique.
const STALE_TIME = 60 * 60 * 1000; // 1h

export function useCourses(anneeAcademique: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.courses(anneeAcademique ?? ''),
    queryFn: () => fetchCourses(anneeAcademique as string),
    enabled: Boolean(anneeAcademique),
    staleTime: STALE_TIME,
  });
}
