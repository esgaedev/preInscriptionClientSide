import { useQuery } from '@tanstack/react-query';
import { fetchNationalities } from '@/services/nationalityService';
import { QUERY_KEYS } from '@/constants/api';

// Référentiel quasi statique (liste de pays) — pas besoin de le revalider à
// chaque montage du formulaire. Combiné à la persistance localStorage
// (src/api/persister.ts), l'API n'est en pratique appelée qu'une fois par
// jour au lieu de à chaque chargement de page.
const STALE_TIME = 24 * 60 * 60 * 1000; // 24h

export function useNationalities() {
  return useQuery({
    queryKey: QUERY_KEYS.nationalities,
    queryFn: fetchNationalities,
    staleTime: STALE_TIME,
  });
}
