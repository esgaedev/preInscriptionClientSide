/** Accepts local or international phone numbers: optional leading +, 8 to 15 digits. */
export const PHONE_REGEX = /^\+?[0-9]{8,15}$/;

export const MIN_STUDENT_AGE = 12;
export const MAX_STUDENT_AGE = 80;

export function isPlausibleBirthDate(value: string): boolean {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age -= 1;
  }
  return age >= MIN_STUDENT_AGE && age <= MAX_STUDENT_AGE;
}
