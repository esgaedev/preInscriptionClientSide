// Constantes pour les endpoints API
const API_BASE = '/API';
const ENDPOINTS = {
  ACADEMIC_YEARS: '/AnneeAcademique',
  COURSES: '/ParcoursGet',
  NATIONALITIES: '/Nationalite',
  PRE_REGISTRATION: '/etudiant/preinscriptions',
} as const;

export const API_ENDPOINTS = {
  academicYears: `${API_BASE}${ENDPOINTS.ACADEMIC_YEARS}`,
  courses: (anneeAcademique: string) => `${API_BASE}${ENDPOINTS.COURSES}/${encodeURIComponent(anneeAcademique)}`,
  nationalities: `${API_BASE}${ENDPOINTS.NATIONALITIES}`,
  preRegistration: `${API_BASE}${ENDPOINTS.PRE_REGISTRATION}`,
} as const;

export const QUERY_KEYS = {
  academicYears: ['academic-years'] as const,
  courses: (anneeAcademique: string) => ['courses', anneeAcademique] as const,
  nationalities: ['nationalities'] as const,
};
