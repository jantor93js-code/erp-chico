const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const rows = await prisma.document.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
    console.log('COUNT', rows.length);
    console.log(JSON.stringify(rows[0], null, 2));
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
