/**
 * Liste des établissements scolaires au Congo
 */
export const ESTABLISHMENTS = [
  // Lycées publics
  'Lycée Thomas Sankara A',
  'Lycée Thomas Sankara B',
  'Lycée de la Révolution',
  'Lycée Savorgnan de Brazza',
  'Lycée Lumumba',
  'Lycée scientifique de Massengo',
  'Lycée Technique 5 Février 1979',
  'Lycée Technique Commercial 1er Mai',
  'Lycée Français St Exupery de Brazzaville',
  
  // Collèges et Lycées privés
  'Collège-Lycée Anne Marie-Javouhey',
  'Lycée Chaminade',
  'Lycée Sainte Rita',
  'Groupe Scolaire Saint Nicolas',
  'Groupe Scolaire REMO',
  'Complexe Scolaire La Relève',
  'École Moderne La Grâce Divine',
  'Groupe Scolaire Aliyou Fatima',
  'Complexe Scolaire Professeur Dieu-Veille',
  
  // Écoles privées
  'École privée le Havre de la pédagogie',
  'École Privée Claparede 2',
  'École privé Aimé Césaire',
  'Institut le Printemps',
] as const;

export type Establishment = typeof ESTABLISHMENTS[number];
