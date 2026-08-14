const fs = require('fs');
const path = require('path');

function parseCsv(text) {
  // Handles CR, LF, and CRLF line endings, semicolon delimiter, and
  // double-quoted fields (with "" as an escaped quote inside a field).
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const len = text.length;

  const pushField = () => {
    row.push(field);
    field = '';
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };

  while (i < len) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ';') {
      pushField();
      i += 1;
      continue;
    }
    if (ch === '\r' || ch === '\n') {
      // Swallow \r\n as one line break; also handle lone \r or \n.
      if (ch === '\r' && text[i + 1] === '\n') {
        i += 2;
      } else {
        i += 1;
      }
      if (field.length > 0 || row.length > 0) {
        pushRow();
      }
      continue;
    }
    field += ch;
    i += 1;
  }
  if (field.length > 0 || row.length > 0) {
    pushRow();
  }

  return rows;
}

function cleanText(value) {
  if (value === undefined || value === null) return '';
  return value
    .replace(/�/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeKey(nom, region) {
  return `${nom.toLowerCase().trim().replace(/\s+/g, ' ')}|${region
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')}`;
}

function loadCsv(filePath, encoding) {
  const buf = fs.readFileSync(filePath);
  const text = new TextDecoder(encoding).decode(buf);
  const rows = parseCsv(text).filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));

  const header = rows[0].map((h) => cleanText(h));
  const nomIdx = header.findIndex((h) => h.toLowerCase() === 'nometis' || h.toLowerCase() === 'nomets');
  const regionIdx = header.findIndex((h) => h.toLowerCase() === 'regionets');

  const dataRows = rows.slice(1);
  const records = dataRows.map((r) => ({
    nom: cleanText(r[nomIdx]),
    region: cleanText(r[regionIdx]),
  }));

  return { header, records, totalLines: dataRows.length };
}

const file1 = path.join(__dirname, '..', 'Ets_MEPPSA.csv');
const file2 = path.join(__dirname, '..', 'Ets_METP.csv');

const csv1 = loadCsv(file1, 'macintosh');
const csv2 = loadCsv(file2, 'windows-1252');

const merged = [...csv1.records, ...csv2.records];

const emptyNom = merged.filter((r) => !r.nom).length;
const emptyRegion = merged.filter((r) => !r.region).length;

const seen = new Map();
let duplicates = 0;
const deduped = [];
for (const rec of merged) {
  const key = normalizeKey(rec.nom, rec.region);
  if (seen.has(key)) {
    duplicates += 1;
    continue;
  }
  seen.set(key, true);
  deduped.push(rec);
}

deduped.sort((a, b) => a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' }));

const final = deduped.map((rec, idx) => ({
  id: idx + 1,
  nom: rec.nom,
  region: rec.region,
}));

const outPath = path.join(__dirname, '..', 'src', 'data', 'lycees.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(final, null, 2) + '\n', 'utf8');

console.log('CSV1 (Ets_MEPPSA.csv) lignes analysées:', csv1.totalLines);
console.log('CSV2 (Ets_METP.csv) lignes analysées:', csv2.totalLines);
console.log('Total lignes analysées:', csv1.totalLines + csv2.totalLines);
console.log('Doublons supprimés:', duplicates);
console.log('Nombre final de lycées:', final.length);
console.log('Lycées sans région:', emptyRegion);
console.log('Lycées sans nom (avant dédup):', emptyNom);
console.log('Fichier créé:', outPath);
