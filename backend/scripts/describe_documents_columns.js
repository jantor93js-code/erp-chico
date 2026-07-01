const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async ()=>{
  const res = await prisma.$queryRaw`SELECT column_name, is_nullable, column_default, data_type FROM information_schema.columns WHERE table_name='documents' ORDER BY ordinal_position`;
  console.log(JSON.stringify(res, null, 2));
  await prisma.$disconnect();
})().catch(e=>{console.error(e); process.exit(1)});
