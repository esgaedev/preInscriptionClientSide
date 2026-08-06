/**
 * Utilitaires de validation et de formatage pour le formulaire
 */

// Mapping nationalité → pays (à compléter selon vos données API)
// Note: Vous devrez peut-être ajuster ces valeurs selon les IDs réels de votre API
const NATIONALITY_TO_COUNTRY: Record<string, string> = {
  '1': 'Cameroun',
  '2': 'France',
  '3': 'Sénégal',
  '4': 'Côte d\'Ivoire',
  '5': 'Mali',
  '6': 'Gabon',
  '7': 'Congo',
  '8': 'Togo',
  '9': 'Bénin',
  '10': 'Burkina Faso',
  '11': 'Guinée',
  '12': 'Niger',
  '13': 'Tchad',
  '14': 'Centrafrique',
  '15': 'Rwanda',
  '16': 'Burundi',
  '17': 'Congo Brazzaville',
  '18': 'Angola',
  '19': 'Nigeria',
  '20': 'Ghana',
  // Ajoutez d'autres mappings selon vos données de nationalités de l'API
};

/**
 * Propose le pays correspondant à la nationalité choisie
 */
export function getCountryFromNationality(nationalityId: number | string): string {
  const id = String(nationalityId);
  return NATIONALITY_TO_COUNTRY[id] || '';
}

/**
 * Valide que l'arrondissement est entre 1 et 10
 */
export function validateArrondissement(arrondissement: number): boolean {
  return arrondissement >= 1 && arrondissement <= 10;
}