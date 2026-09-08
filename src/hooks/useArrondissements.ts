import { useQuery } from '@tanstack/react-query';
import { fetchArrondissements } from '@/services/arrondissementService';
import { QUERY_KEYS } from '@/constants/api';

// Référentiel quasi statique (découpage administratif) — voir la note dans
// useNationalities.ts pour le raisonnement.
const STALE_TIME = 24 * 60 * 60 * 1000; // 24h

export function useArrondissements() {
  return useQuery({
    queryKey: QUERY_KEYS.arrondissements,
    queryFn: fetchArrondissements,
    staleTime: STALE_TIME,
  });
}
