import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/services/courseService';
import { QUERY_KEYS } from '@/constants/api';

// Même clé de cache que useCourses (volontaire) : AcademicStep utilise les
// deux hooks côte à côte pour la même année, et sans ça react-query ne les
// voit pas comme la même donnée — il appelait /ParcoursGet deux fois en
// parallèle à chaque fois. `select` dérive juste les niveaux uniques depuis
// le résultat déjà mis en cache par useCourses, sans second appel réseau.
// Même staleTime que useCourses : sinon chaque hook gère sa propre fraîcheur
// pour cette même clé partagée, et le plus court des deux redéclenchera un
// refetch que l'autre jugeait inutile.
const STALE_TIME = 60 * 60 * 1000; // 1h

export function useLevels(anneeAcademique: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.courses(anneeAcademique ?? ''),
    queryFn: () => fetchCourses(anneeAcademique as string),
    enabled: Boolean(anneeAcademique),
    staleTime: STALE_TIME,
    select: (courses) => {
      const uniqueLevels = Array.from(
        new Set(courses.map((course) => course.Niveau).filter((n) => n !== undefined)),
      ).sort((a, b) => a - b);

      return uniqueLevels.map((level) => ({ Niveau: level }));
    },
  });
}
