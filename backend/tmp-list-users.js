const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        scope: true,
        roleId: true,
        tenantId: true,
      },
      orderBy: { email: 'asc' },
      take: 100,
    });

    console.log(JSON.stringify(
      users.map(u => ({
        id: u.id,
        email: u.email,
        password: u.password,
        passwordLength: u.password?.length,
        scope: u.scope,
        roleId: u.roleId,
        tenantId: u.tenantId,
      })),
      null,
      2,
    ));
  } catch (e) {
    console.error('ERROR', e);
  } finally {
    await prisma.$disconnect();
  }
})();
