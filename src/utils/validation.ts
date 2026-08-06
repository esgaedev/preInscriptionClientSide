/**
 * Utilitaires de validation et de formatage pour le formulaire
 */

// Mapping nationalité → pays, indexé par le libellé (`DésignNationalité`)
// renvoyé par l'API plutôt que par son id. Les ids sont des clés primaires
// arbitraires côté backend (non stables), alors que ces libellés reflètent
// les nationalités réellement configurées dans /API/Nationalite.
const NATIONALITY_LABEL_TO_COUNTRY: Record<string, string> = {
  'Congolaise': 'Congo',
  'Congolaise (RDC)': 'République démocratique du Congo',
  'Française': 'France',
  'Camerounaise': 'Cameroun',
  'Tchadienne': 'Tchad',
  'Malienne': 'Mali',
  'Centrafricaine': 'République centrafricaine',
  'Rwandaise': 'Rwanda',
  'Burkinabé': 'Burkina Faso',
  'Ivoirienne': "Côte d'Ivoire",
  'Beninoise': 'Bénin',
  'Angolaise': 'Angola',
  'Togolaise': 'Togo',
  'Gabonaise': 'Gabon',
  'Portugaise': 'Portugal',
  'Chinoise': 'Chine',
  'Comorienne': 'Comores',
  'Équatoguinéenne': 'Guinée équatoriale',
  'Américaine': 'États-Unis',
  'Haïtienne': 'Haïti',
  'Malgache': 'Madagascar',
  'Bissau-Guinéenne': 'Guinée-Bissau',
  'Guinéenne': 'Guinée',
  'Burundaise': 'Burundi',
};

/**
 * Propose le pays correspondant au libellé de nationalité choisi (ex:
 * "Camerounaise" → "Cameroun"). Renvoie une chaîne vide si le libellé n'est
 * pas reconnu, pour ne jamais écraser silencieusement le pays saisi par
 * l'utilisateur avec une valeur incorrecte.
 */
export function getCountryFromNationality(designNationalite: string): string {
  return NATIONALITY_LABEL_TO_COUNTRY[designNationalite] ?? '';
}

/**
 * Valide que l'arrondissement est entre 1 et 10
 */
export function validateArrondissement(arrondissement: number): boolean {
  return arrondissement >= 1 && arrondissement <= 10;
}
