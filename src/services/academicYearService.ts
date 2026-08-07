import { axiosClient } from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/constants/api';
import { extractAcademicYear } from '@/utils/normalizers';

/**
 * Fetches the current academic year directly from the API.
 * The endpoint returns a single JSON object with the academic year value.
 */
export async function fetchDefaultAcademicYear(): Promise<string> {
  const { data } = await axiosClient.get<unknown>(API_ENDPOINTS.academicYears);
  const year = extractAcademicYear(data);
  if (!year) {
    throw new Error("Aucune année académique n'est disponible pour le moment.");
  }
  return year;
}
