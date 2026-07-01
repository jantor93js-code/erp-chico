const { PrismaClient } = require('@prisma/client');
(async function(){
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRawUnsafe(`SELECT id, codigo, nombre, tipo::text as tipo, area, activo FROM documents WHERE tipo::text ILIKE '%Pol%' LIMIT 100`);
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error('ERROR', e);
    process.exit(2);
  } finally {
    await prisma.$disconnect();
  }
})();
