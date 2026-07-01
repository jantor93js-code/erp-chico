const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizeText(v) {
  if (!v && v !== 0) return undefined;
  const s = String(v).trim();
  return s.length > 0 ? s : undefined;
}

(async ()=>{
  try{
    const filePath = process.argv[2] || path.resolve(process.env.HOME || process.env.USERPROFILE || '.', 'Downloads', 'Plantilla_Biblioteca_Documental.json');
    console.log('Reading JSON:', filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = JSON.parse(content);
    const report = [];
    for(const [idx, rec] of records.entries()){
      const codigoManual = normalizeText(rec.codigo_manual);
      const codigoDependencia = normalizeText(rec.codigo_dependencia);
      const matchCode = codigoManual || codigoDependencia || null;
      let db = null;
      if(matchCode){
        const rows = await prisma.$queryRawUnsafe(`SELECT id,codigo,nombre,"fechaRevision", "estadoDocumental", estado_documental_id FROM documents WHERE codigo = $1 LIMIT 1`, matchCode);
        db = rows && rows.length ? rows[0] : null;
        if(db && db.estado_documental_id){
          try{
            const st = await prisma.documentStatusRef.findUnique({ where: { id: db.estado_documental_id } });
            db.estado_nombre = st ? st.nombre : null;
          }catch(e){ db.estado_nombre = null; }
        }
      }
      report.push({
        row: idx+1,
        codigo_json: matchCode,
        nombre_json: normalizeText(rec.nombre_documento) || null,
        estado_json: normalizeText(rec.estado_documento) || null,
        fechaRevision_json: normalizeText(rec.fecha_ultima_revision) || null,
        db: db ? {
          id: db.id,
          codigo: db.codigo,
          nombre: db.nombre || null,
          fechaRevision: db.fechaRevision || null,
          estadoDocumental: db.estadoDocumental || null,
          estado_documental_id: db.estado_documental_id || null,
          estado_nombre: db.estado_nombre || null,
        } : null,
      });
    }
    const outPath = path.resolve('scripts','fix_report.json');
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log('Wrote report:', outPath);
    process.exit(0);
  }catch(err){
    console.error(err.message);
    process.exit(1);
  }finally{ try{ await prisma.$disconnect(); }catch(e){} }
})();
