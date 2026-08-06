import { useQuery } from '@tanstack/react-query';
import { fetchNationalities } from '@/services/nationalityService';
import { QUERY_KEYS } from '@/constants/api';

export function useNationalities() {
  return useQuery({
    queryKey: QUERY_KEYS.nationalities,
    queryFn: fetchNationalities,
  });
}
