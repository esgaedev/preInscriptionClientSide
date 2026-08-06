import { axiosClient } from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/constants/api';
import { extractNationality } from '@/utils/normalizers';
import type { Nationality } from '@/types';

export async function fetchNationalities(): Promise<Nationality[]> {
  const { data } = await axiosClient.get<unknown[]>(API_ENDPOINTS.nationalities);
  const list = Array.isArray(data) ? data : [];
  return list
    .map(extractNationality)
    .filter((nationality): nationality is Nationality => nationality !== null);
}
