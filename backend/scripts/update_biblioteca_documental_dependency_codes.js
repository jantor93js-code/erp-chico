const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

function normalizeText(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length > 0 ? s : null;
}

(async () => {
  const prisma = new PrismaClient();
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE documents ADD COLUMN IF NOT EXISTS codigo_dependencia TEXT`);

    const filePath = path.resolve(process.env.USERPROFILE || process.env.HOME || '.', 'Downloads', 'Plantilla_Biblioteca_Documental.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const records = JSON.parse(raw);

    if (!Array.isArray(records)) throw new Error('El archivo no contiene un arreglo JSON.');

    let updated = 0;
    let missing = 0;

    for (const record of records) {
      const codigoManual = normalizeText(record.codigo_manual);
      const codigoDependencia = normalizeText(record.codigo_dependencia);
      if (!codigoManual && !codigoDependencia) {
        continue;
      }

      const matchCode = codigoManual || codigoDependencia;
      const doc = await prisma.document.findFirst({ where: { codigo: matchCode } });
      if (!doc) {
        missing += 1;
        continue;
      }

      await prisma.document.update({
        where: { id: doc.id },
        data: { codigoDependencia: codigoDependencia || null },
      });

      updated += 1;
      console.log(`Updated ${matchCode} -> ${codigoDependencia || '(null)'}`);
    }

    console.log(JSON.stringify({ updated, missing }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
})();
