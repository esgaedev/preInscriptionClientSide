import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';
import { REFERENCE_DATA_GC_TIME } from './queryClient';
import { QUERY_KEYS } from '@/constants/api';

/**
 * Données de référence qu'il est sûr de garder en localStorage d'un
 * chargement de page à l'autre : elles viennent d'endpoints en lecture seule
 * (nationalités, arrondissements, année académique, parcours) et changent
 * rarement. On liste explicitement leurs clés plutôt que de tout persister
 * par défaut, pour ne jamais capturer par erreur une future query sensible
 * (brouillon de préinscription, résultat de soumission...).
 */
const PERSISTABLE_QUERY_KEY_PREFIXES: readonly string[] = [
  QUERY_KEYS.nationalities[0],
  QUERY_KEYS.arrondissements[0],
  QUERY_KEYS.academicYears[0],
  QUERY_KEYS.courses('')[0],
];

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'esgae:query-cache',
});

export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister,
  // Une entrée plus vieille que ça au moment du chargement est ignorée —
  // évite de resservir indéfiniment des données de référence obsolètes si
  // l'utilisateur laisse un onglet ouvert des jours durant.
  maxAge: REFERENCE_DATA_GC_TIME,
  // Change cette valeur si la forme des données mises en cache change un
  // jour (nouveau champ requis, etc.) — invalide alors tout cache persisté
  // d'une version précédente au lieu de risquer de le réhydrater tel quel.
  buster: 'v1',
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      query.state.status === 'success' &&
      PERSISTABLE_QUERY_KEY_PREFIXES.includes(query.queryKey[0] as string),
  },
};
