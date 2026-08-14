/**
 * Liste des professions et métiers
 */
export const PROFESSIONS = [
  // Informatique et Technologies
  'Développeur informatique',
  'Développeur web',
  'Développeur mobile',
  'Administrateur réseau',
  'Administrateur système',
  'Technicien informatique',
  'Technicien réseau',
  'Ingénieur informatique',
  'Ingénieur réseau',
  'Ingénieur logiciel',
  'Analyste informatique',
  'Analyste cybersécurité',
  'Expert en cybersécurité',
  'Administrateur de bases de données',
  'Data Analyst',
  'Data Scientist',
  'DevOps',
  'Architecte logiciel',
  'Concepteur logiciel',
  'Support informatique',
  'Webmaster',
  'Testeur logiciel',
  'Chef de projet informatique',
  'Consultant informatique',
  'Formateur en informatique',
  'Enseignant en informatique',
  
  // Design et Création
  'Infographiste',
  'Graphiste',
  'Webdesigner',
  'UX/UI Designer',
  'Photographe',
  
  // Agriculture et Environnement
  'Agriculteur',
  
  // Architecture et Construction
  'Architecte',
  'Maçon',
  
  // Artisanat
  'Artisan',
  'Soudeur',
  'Plombier',
  
  // Droit et Justice
  'Avocat',
  'Juriste',
  
  // Transport et Logistique
  'Chauffeur',
  'Logisticien',
  
  // Gestion et Administration
  'Commercial',
  'Comptable',
  'Magasinier',
  'Secrétaire',
  
  // Services personnels
  'Coiffeur',
  'Esthéticien',
  
  // Hôtellerie et Restauration
  'Cuisinier',
  
  // Électricité et Énergie
  'Électricien',
  
  // Éducation
  'Enseignant',
  'Professeur',
  'Formateur',
  
  // Entrepreneuriat
  'Entrepreneur',
  
  // Santé
  'Infirmier',
  'Médecin',
  'Pharmacien',
  
  // Industrie et Maintenance
  'Mécanicien',
  'Technicien',
  'Ouvrier',
  
  // Forces de l'ordre et Sécurité
  'Militaire',
  'Policier',
  
  // Média et Communication
  'Journaliste',
  'Musicien',
  
  // Fonction publique
  'Fonctionnaire',
  
  // Autres
  'Vendeur',
] as const;

export type Profession = typeof PROFESSIONS[number];
