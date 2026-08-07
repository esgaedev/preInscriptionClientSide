import { useQuery } from '@tanstack/react-query';
import { fetchArrondissements } from '@/services/arrondissementService';
import { QUERY_KEYS } from '@/constants/api';

export function useArrondissements() {
  return useQuery({
    queryKey: QUERY_KEYS.arrondissements,
    queryFn: fetchArrondissements,
  });
}
