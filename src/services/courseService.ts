import { axiosClient } from '@/api/axiosClient';
import { API_ENDPOINTS } from '@/constants/api';
import { extractCourse } from '@/utils/normalizers';
import type { Course } from '@/types';

export async function fetchCourses(anneeAcademique: string): Promise<Course[]> {
  const { data } = await axiosClient.get<unknown[]>(API_ENDPOINTS.courses(anneeAcademique));
  const list = Array.isArray(data) ? data : [];
  return list
    .map(extractCourse)
    .filter((course): course is Course => course !== null);
}
