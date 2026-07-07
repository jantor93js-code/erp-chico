const xlsx = require('xlsx');
const path = require('path');
const file = path.resolve(__dirname, '..', 'pipeline', 'inputs', 'Listado_Maestro_2026__3_.xlsx');
const wb = xlsx.readFile(file);
for (const sheetName of wb.SheetNames) {
  if (!/proces/i.test(sheetName)) continue;
  const ws = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: '', raw: false, blankrows: false });
  console.log('SHEET', sheetName);
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || {};
    const text = JSON.stringify(row);
    if (text.includes('PRO-PROY-01') || text.includes('Proceso proyectos especiales') || text.includes('Procedimiento Metodológico')) {
      console.log('ROW', i + 1, text);
    }
  }
  console.log('---');
}
