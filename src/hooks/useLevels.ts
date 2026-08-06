import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/services/courseService';

export function useLevels(anneeAcademique: string | undefined) {
  return useQuery({
    queryKey: ['levels', anneeAcademique],
    queryFn: async () => {
      const courses = await fetchCourses(anneeAcademique as string);
      // Extraire les niveaux uniques depuis les parcours
      const uniqueLevels = Array.from(
        new Set(courses.map(course => course.Niveau).filter(n => n !== undefined))
      ).sort((a, b) => a - b);
      
      return uniqueLevels.map(level => ({ Niveau: level }));
    },
    enabled: Boolean(anneeAcademique),
  });
}
