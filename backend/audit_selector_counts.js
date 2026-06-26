const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const counts = await Promise.all([
      prisma.pmoClient.count(),
      prisma.pmoProgram.count(),
      prisma.pmoInitiative.count(),
      prisma.pmoProject.count(),
      prisma.user.count({ where: { scope: 'PMO' } }),
      prisma.area.count(),
      prisma.process.count(),
      prisma.documentTypeRef.count(),
      prisma.documentStatusRef.count(),
    ]);

    console.log(JSON.stringify({
      clients: counts[0],
      programs: counts[1],
      initiatives: counts[2],
      projects: counts[3],
      users_pmo: counts[4],
      areas: counts[5],
      processes: counts[6],
      documentTypes: counts[7],
      documentStatuses: counts[8],
    }, null, 2));
  } catch (e) {
    console.error('ERROR', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
