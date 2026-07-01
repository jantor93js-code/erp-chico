const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizeText(v) {
  if (!v && v !== 0) return undefined;
  const s = String(v).trim();
  return s.length > 0 ? s : undefined;
}

function normalizeCatalogCode(value) {
  if (!value) return '';
  return String(value)
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .toUpperCase();
}

(async ()=>{
  try{
    const filePath = process.argv[2] || path.resolve(process.env.HOME || process.env.USERPROFILE || '.', 'Downloads', 'Plantilla_Biblioteca_Documental.json');
    console.log('Using file:', filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = JSON.parse(content);
    if(!Array.isArray(records)) throw new Error('JSON must be an array');

    const report = { updated: [], skipped: [], missing: [] };

    for(const [idx, rec] of records.entries()){
      const codigoManual = normalizeText(rec.codigo_manual);
      const codigoDependencia = normalizeText(rec.codigo_dependencia);
      const matchCode = codigoManual || codigoDependencia;
      if(!matchCode){
        report.missing.push({ row: idx+1, reason: 'no codigo_manual ni codigo_dependencia' });
        continue;
      }

      // find document by codigo
      const docRows = await prisma.$queryRawUnsafe(`SELECT id,codigo,nombre,"fechaRevision", "estadoDocumental", estado_documental_id FROM documents WHERE codigo = $1 LIMIT 1`, matchCode);
      const doc = Array.isArray(docRows) && docRows.length ? docRows[0] : null;
      if(!doc){
        report.missing.push({ row: idx+1, codigo: matchCode, reason: 'document not found' });
        continue;
      }

      const updates = {};
      const desiredName = normalizeText(rec.nombre_documento) || undefined;
      // If JSON provides a name, update it. If name is empty in JSON, leave nombre as-is
      // but mark the document as pending ('Sin iniciar') unless the JSON provided an explicit estado.
      if(desiredName && desiredName !== doc.nombre){
        updates.nombre = desiredName;
      }

      const desiredFechaRevision = normalizeText(rec.fecha_ultima_revision) ? (new Date(rec.fecha_ultima_revision)) : null;
      const currentFecha = doc.fechaRevision ? new Date(doc.fechaRevision) : null;
      const fechaChanged = (desiredFechaRevision === null && currentFecha !== null) || (desiredFechaRevision !== null && (!currentFecha || desiredFechaRevision.getTime() !== currentFecha.getTime()));
      if(desiredFechaRevision !== undefined && fechaChanged){
        updates.fechaRevision = desiredFechaRevision ? desiredFechaRevision.toISOString() : null;
      }

      let statusIdToSet = null;
      // If the JSON provides an explicit estado_documento, prefer it.
      // If nombre is empty in JSON and no estado_documento is provided, mark as 'Sin iniciar' (pendiente).
      if(rec.estado_documento){
        const statusName = normalizeText(rec.estado_documento);
        const normalizedCode = normalizeCatalogCode(statusName);
        // try find existing status by codigo or nombre
        let status = await prisma.documentStatusRef.findFirst({ where: { OR: [{ codigo: normalizedCode }, { nombre: { equals: statusName, mode: 'insensitive' } }] } });
        if(!status){
          // create a new status ref
          status = await prisma.documentStatusRef.create({ data: { nombre: statusName, codigo: normalizedCode || `EST_${Date.now()}`, descripcion: 'Importado (fix)', activo: true, color: '#E5E7EB' } });
        }
        statusIdToSet = status.id;
        // if different from current
        if(String(statusIdToSet) !== String(doc.estado_documental_id)){
          updates.estado_documental_id = statusIdToSet;
        }
      } else if (desiredName === undefined && (rec.nombre_documento === null || String(rec.nombre_documento || '').trim() === '')){
        // JSON explicitly left nombre empty -> mark as pending
        const pendingName = 'Sin iniciar';
        const normalizedCode = normalizeCatalogCode(pendingName);
        let status = await prisma.documentStatusRef.findFirst({ where: { OR: [{ codigo: normalizedCode }, { nombre: { equals: pendingName, mode: 'insensitive' } }] } });
        if(!status){
          status = await prisma.documentStatusRef.create({ data: { nombre: pendingName, codigo: normalizedCode || `EST_${Date.now()}`, descripcion: 'Marcado pendiente por import', activo: true, color: '#F3F4F6' } });
        }
        statusIdToSet = status.id;
        if(String(statusIdToSet) !== String(doc.estado_documental_id)){
          updates.estado_documental_id = statusIdToSet;
        }
      }

      // If nothing to update, skip
      if(Object.keys(updates).length === 0){
        report.skipped.push({ codigo: matchCode, reason: 'no changes' });
        continue;
      }

      // Build SQL update statement only for allowed columns
      const cols = [];
      const params = [];
      let paramIdx = 1;
      if(updates.nombre !== undefined){ cols.push(`nombre = $${paramIdx++}`); params.push(updates.nombre); }
      if(updates.fechaRevision !== undefined){ cols.push(`"fechaRevision" = $${paramIdx++}`); params.push(updates.fechaRevision); }
      if(updates.estado_documental_id !== undefined){ cols.push(`estado_documental_id = $${paramIdx++}`); params.push(updates.estado_documental_id); }
      params.push(matchCode);

      const sql = `UPDATE documents SET ${cols.join(', ')} WHERE codigo = $${paramIdx}`;
      try{
        await prisma.$executeRawUnsafe(sql, ...params);
        report.updated.push({ codigo: matchCode, changes: updates });
        console.log('Updated', matchCode, updates);
      }catch(e){
        console.error('Failed to update', matchCode, e.message);
        report.missing.push({ codigo: matchCode, reason: 'update failed', error: e.message });
      }
    }

    console.log('Summary:', JSON.stringify({ updated: report.updated.length, skipped: report.skipped.length, missing: report.missing.length }, null, 2));
    if(report.updated.length) console.log('Updated details sample:', report.updated.slice(0,20));

    process.exit(0);
  }catch(err){
    console.error('ERROR', err.message);
    process.exit(1);
  }finally{
    try{ await prisma.$disconnect(); }catch(e){}
  }
})();
