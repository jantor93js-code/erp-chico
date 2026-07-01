const { PrismaClient } = require('@prisma/client');
(async function(){
  const prisma = new PrismaClient();
  try {
    const cols = await prisma.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_name='documents' ORDER BY ordinal_position");
    console.log(JSON.stringify(cols, null, 2));
  } catch (e) {
    console.error('ERROR', e);
    process.exit(2);
  } finally {
    await prisma.$disconnect();
  }
})();
