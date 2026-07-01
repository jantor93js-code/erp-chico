const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

function normalizeText(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.length > 0 ? str : null;
}

(async () => {
  const prisma = new PrismaClient();
  try {
    const jsonPath = process.argv[2] || path.resolve(process.env.USERPROFILE || process.env.HOME || '.', 'Downloads', 'Plantilla_Biblioteca_Documental.json');
    console.log('Usando archivo JSON:', jsonPath);

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const records = JSON.parse(raw);
    if (!Array.isArray(records)) {
      throw new Error('El archivo debe ser un arreglo JSON');
    }

    await prisma.$executeRawUnsafe('ALTER TABLE documents ADD COLUMN IF NOT EXISTS codigo_dependencia TEXT');

    let updated = 0;
    let missing = 0;
    for (const [index, rec] of records.entries()) {
      const codigoManual = normalizeText(rec.codigo_manual);
      const codigoDependencia = normalizeText(rec.codigo_dependencia);
      const nombre = normalizeText(rec.nombre_documento);
      const proceso = normalizeText(rec.proceso_asociado);
      const area = normalizeText(rec.area_dependencia);

      if (!codigoDependencia && !codigoManual) {
        console.warn(`Fila ${index + 1}: no tiene codigo_manual ni codigo_dependencia, se omite`);
        missing += 1;
        continue;
      }

      const doc = await prisma.document.findFirst({
        where: {
          codigoDependencia: codigoDependencia || undefined,
          nombre: nombre || undefined,
          area: area || undefined,
          proceso: proceso || undefined,
        },
      });

      if (!doc) {
        console.warn(`Fila ${index + 1}: documento no encontrado para codigo_dependencia=${codigoDependencia} nombre=${nombre}`);
        missing += 1;
        continue;
      }

      const newCodigo = codigoManual || null;
      if (doc.codigo === newCodigo) {
        continue;
      }

      await prisma.document.update({
        where: { id: doc.id },
        data: { codigo: newCodigo },
      });
      updated += 1;
      console.log(`Actualizado doc id=${doc.id} codigo -> ${newCodigo}`);
    }

    console.log(`Resumen: updated=${updated}, missing=${missing}`);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
