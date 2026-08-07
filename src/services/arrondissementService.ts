import { axiosClient } from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/constants/api';
import { extractArrondissement } from '@/utils/normalizers';
import type { Arrondissement } from '@/types';

export async function fetchArrondissements(): Promise<Arrondissement[]> {
  const { data } = await axiosClient.get<unknown[]>(API_ENDPOINTS.arrondissements);
  const list = Array.isArray(data) ? data : [];
  return list
    .map(extractArrondissement)
    .filter((arrondissement): arrondissement is Arrondissement => arrondissement !== null);
}
