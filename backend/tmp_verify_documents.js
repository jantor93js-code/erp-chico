const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    const rows = await prisma.document.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombre: true,
        estadoDocumental: true,
        estado: true,
        vigencia: true,
        activo: true,
      },
    });
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
