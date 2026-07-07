const xlsx = require('xlsx');
const path = require('path');
const file = path.resolve(__dirname, '..', 'pipeline', 'inputs', 'Listado_Maestro_2026__3_.xlsx');
const wb = xlsx.readFile(file);
for (const sheet of wb.SheetNames) {
  const ws = wb.Sheets[sheet];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: '', raw: false, blankrows: false });
  if (!rows.length) continue;
  console.log('SHEET', sheet);
  console.log(JSON.stringify(rows[0], null, 2));
  console.log('---');
}
