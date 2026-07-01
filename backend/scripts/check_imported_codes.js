const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async ()=>{
  try{
    const codes = ['POL-SIG-01','POL-SIG-02','POL-SIG-03','MAN-GD-01'];
    const rows = await prisma.$queryRawUnsafe(`SELECT codigo,nombre,tipo::text as tipo,fuente,"origenImportacion",activo FROM documents WHERE codigo IN (${codes.map(c=>"'"+c+"'").join(',')})`);
    console.log(JSON.stringify(rows,null,2));
  }catch(e){
    console.error('ERR', e.message);
    process.exit(1);
  }finally{ await prisma.$disconnect(); }
})();
