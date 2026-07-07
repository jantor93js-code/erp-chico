const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, nombre: true, roleId: true, tenantId: true } });
    console.log('USERS', users.length);
    users.forEach((u) => console.log(JSON.stringify(u)));
  } catch (error) {
    console.error('ERR', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();