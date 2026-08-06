/**
 * The reference endpoints' exact response shape isn't always documented.
 * These helpers probe a handful of plausible key names so the UI keeps
 * working across minor API variations, instead of hard-failing on a single
 * assumed key.
 */

function pick(raw: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null) return raw[key];
  }
  return undefined;
}

export function extractAcademicYear(raw: unknown): string {
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object') {
    const value = pick(raw as Record<string, unknown>, [
      'AnneeAcademique',
      'anneeAcademique',
      'Annee',
      'annee',
      'Libelle',
      'libelle',
      'id',
    ]);
    if (value !== undefined) return String(value);
  }
  return '';
}

export function extractLevel(raw: unknown): { Niveau: number; Libelle: string } | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const id = pick(record, ['Niveau', 'IDNiveau', 'id', 'Id']);
  const label = pick(record, ['Libelle', 'DésignNiveau', 'LibelleNiveau', 'NomNiveau', 'Nom', 'libelle']);
  if (id === undefined) return null;
  return { Niveau: Number(id), Libelle: label !== undefined ? String(label) : String(id) };
}

export function extractCourse(raw: unknown): { IDParcours: number; NomParcours: string; Niveau?: number } | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const id = pick(record, ['IDParcours', 'Id', 'id']);
  const label = pick(record, ['DésignParcours', 'NomParcours', 'Libelle', 'Nom', 'nomParcours']);
  const niveau = pick(record, ['Niveau', 'IDNiveau', 'NiveauId']);
  if (id === undefined) return null;
  return {
    IDParcours: Number(id),
    NomParcours: label !== undefined ? String(label) : String(id),
    Niveau: niveau !== undefined ? Number(niveau) : undefined,
  };
}

export function extractNationality(raw: unknown): { IDNationalité: number; DésignNationalité: string } | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const id = pick(record, ['IDNationalité', 'IDNationalite', 'Id', 'id']);
  const label = pick(record, ['DésignNationalité', 'DesignNationalite', 'Libelle', 'Nom', 'libelle']);
  if (id === undefined) return null;
  return {
    IDNationalité: Number(id),
    DésignNationalité: label !== undefined ? String(label) : String(id),
  };
}
