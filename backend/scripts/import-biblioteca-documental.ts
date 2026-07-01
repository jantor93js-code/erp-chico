import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaService } from '../src/prisma/prisma.service';
import { DocumentsService } from '../src/modules/pmo/documents/documents.service';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Uso: npx ts-node scripts/import-biblioteca-documental.ts <archivo.json>');
    process.exit(1);
  }

  const absolutePath = resolve(process.cwd(), filePath);
  let records: any;

  try {
    const fileContents = readFileSync(absolutePath, 'utf-8');
    records = JSON.parse(fileContents);
  } catch (error) {
    console.error('No se pudo leer o parsear el archivo JSON:', error);
    process.exit(1);
  }

  const prisma = new PrismaService();
  const documentsService = new DocumentsService(prisma);

  try {
    await prisma.$connect();
    const result = await documentsService.importFromJson(records);
    console.log('Importación completada:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error ejecutando la importación:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error inesperado:', error);
  process.exit(1);
});
