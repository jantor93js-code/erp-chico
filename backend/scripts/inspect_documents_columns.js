const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const cols = await prisma.$queryRawUnsafe(
      "select column_name, data_type, is_nullable from information_schema.columns where table_name='documents' order by ordinal_position"
    );
    console.log(JSON.stringify(cols, null, 2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
