import { axiosClient } from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/constants/api';
import { extractAcademicYear } from '@/utils/normalizers';

/**
 * Fetches every academic year the API knows about and returns only the first
 * one — the form must never let the user choose it, per spec.
 */
export async function fetchDefaultAcademicYear(): Promise<string> {
  const { data } = await axiosClient.get<unknown[]>(API_ENDPOINTS.academicYears);
  const list = Array.isArray(data) ? data : [];
  const first = list[0];
  const year = extractAcademicYear(first);
  if (!year) {
    throw new Error("Aucune année académique n'est disponible pour le moment.");
  }
  return year;
}
