"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const prisma_service_1 = require("../src/prisma/prisma.service");
const documents_service_1 = require("../src/modules/pmo/documents/documents.service");
async function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('Uso: npx ts-node scripts/import-biblioteca-documental.ts <archivo.json>');
        process.exit(1);
    }
    const absolutePath = (0, path_1.resolve)(process.cwd(), filePath);
    let records;
    try {
        const fileContents = (0, fs_1.readFileSync)(absolutePath, 'utf-8');
        records = JSON.parse(fileContents);
    }
    catch (error) {
        console.error('No se pudo leer o parsear el archivo JSON:', error);
        process.exit(1);
    }
    const prisma = new prisma_service_1.PrismaService();
    const documentsService = new documents_service_1.DocumentsService(prisma);
    try {
        await prisma.$connect();
        const result = await documentsService.importFromJson(records);
        console.log('Importación completada:');
        console.log(JSON.stringify(result, null, 2));
    }
    catch (error) {
        console.error('Error ejecutando la importación:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main().catch((error) => {
    console.error('Error inesperado:', error);
    process.exit(1);
});
//# sourceMappingURL=import-biblioteca-documental.js.map