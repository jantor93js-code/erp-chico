const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

prisma.$connect()
  .then(async () => {
    const row = await prisma.document.findFirst({
      where: { codigo: 'DOC-HAPPY-002' },
      select: { id: true, codigo: true, nombre: true, version: true, origenImportacion: true, activo: true, createdAt: true },
    });
    console.log(JSON.stringify(row, null, 2));
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
