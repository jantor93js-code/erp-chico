const { PrismaClient } = require('@prisma/client');
(async ()=>{
  const prisma = new PrismaClient();
  try{
    const items = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        cliente: true,
        programa: true,
        iniciativa: true,
        proyecto: true,
        areaRef: true,
        processRef: true,
        tipoRef: true,
        estadoDocumentalRef: true,
      }
    });
    console.log('COUNT', items.length);
  }catch(e){
    console.error('ERROR', e.message);
    console.error(e.stack);
    process.exit(1);
  }finally{
    await prisma.$disconnect();
  }
})();
