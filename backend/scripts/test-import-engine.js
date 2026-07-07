"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const http = require("http");
const client_1 = require("@prisma/client");
function loadDatabaseUrlFromEnv(envPath) {
    if (!fs.existsSync(envPath)) {
        return process.env.DATABASE_URL || '';
    }
    const contents = fs.readFileSync(envPath, 'utf8');
    const match = contents.split(/\r?\n/).find((line) => line.trim().startsWith('DATABASE_URL='));
    if (!match) {
        return process.env.DATABASE_URL || '';
    }
    const rawValue = match.split('=').slice(1).join('=').trim();
    return rawValue.replace(/^['"]|['"]$/g, '');
}
const envPath = path.resolve(__dirname, '..', '.env');
const backendDatabaseUrl = loadDatabaseUrlFromEnv(envPath);
process.env.DATABASE_URL = backendDatabaseUrl;
const prisma = new client_1.PrismaClient();
const BASE_URL = process.env.IMPORT_BASE_URL || 'http://localhost:3001/api/v1/pmo/import/run';
function postImport(payload) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(payload);
        const req = http.request(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode || 0, body: data ? JSON.parse(data) : null });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}
async function getPrismaDocument(codigo) {
    return prisma.document.findUnique({
        where: { codigo },
    });
}
async function deletePrismaDocumentIfExists(codigo) {
    const existing = await getPrismaDocument(codigo);
    if (!existing) {
        return null;
    }
    await prisma.document.delete({
        where: { codigo },
    });
    return existing;
}
async function restorePrismaDocument(original) {
    await prisma.document.deleteMany({ where: { codigo: 'DOC-TEST-001' } });
    if (!original) {
        return;
    }
    await prisma.document.create({
        data: {
            id: original.id,
            codigo: original.codigo,
            codigoDependencia: original.codigoDependencia,
            nombre: original.nombre,
            descripcion: original.descripcion,
            tipo: original.tipo,
            proceso: original.proceso,
            area: original.area,
            version: original.version,
            responsableActualizacion: original.responsableActualizacion,
            responsableRevision: original.responsableRevision,
            estadoDocumental: original.estadoDocumental,
            areaId: original.areaId,
            processId: original.processId,
            tipoId: original.tipoId,
            estadoDocumentalId: original.estadoDocumentalId,
            fechaCreacion: original.fechaCreacion ?? undefined,
            fechaRevision: original.fechaRevision ?? undefined,
            observaciones: original.observaciones,
            enlace: original.enlace,
            fuente: original.fuente,
            origenImportacion: original.origenImportacion,
            activo: original.activo,
            clienteId: original.clienteId,
            programId: original.programId,
            initiativeId: original.initiativeId,
            projectId: original.projectId,
            createdAt: original.createdAt,
            updatedAt: original.updatedAt,
        },
    });
}
function printFailure(step, expected, actual, stack) {
    console.log(`FAILED`);
    console.log(`STEP:${step}`);
    console.log(`EXPECTED:${JSON.stringify(expected)}`);
    console.log(`ACTUAL:${JSON.stringify(actual)}`);
    console.log(`STACK:${stack}`);
}
async function main() {
    const scriptDatabaseUrl = process.env.DATABASE_URL || '';
    const coincide = backendDatabaseUrl === scriptDatabaseUrl;
    console.log(`Backend DATABASE_URL:${backendDatabaseUrl}`);
    console.log(`Script DATABASE_URL:${scriptDatabaseUrl}`);
    console.log(`¿Coinciden?${coincide ? 'Sí' : 'No'}`);
    const case1Payload = {
        source: {
            metadata: {
                fechaGeneracion: '2026-07-04',
                versionNormalizador: '1.0',
                versionTransformador: '1.0',
            },
            catalogos: {
                areas: [],
                procesos: [],
                tiposDocumentales: [],
                estados: [],
                responsablesActualizacion: [],
                responsablesRevision: [],
                codigosArea: [],
            },
            documentos: [
                {
                    codigoDocumento: 'DOC-TEST-001',
                    nombreDocumento: 'Documento test 1',
                    version: '1.0',
                },
            ],
        },
        tenantId: 'tenant-001',
        usuario: 'admin',
    };
    let createResult = 'FAIL';
    let updateResult = 'FAIL';
    let skipResult = 'FAIL';
    let originalDocument = null;
    try {
        originalDocument = await deletePrismaDocumentIfExists('DOC-TEST-001');
        const response1 = await postImport(case1Payload);
        const body1 = response1.body;
        const session1 = body1?.session;
        const changeSet1 = body1?.changeSet;
        const plan1 = body1?.persistencePlan;
        const execution1 = body1?.executionResult;
        const createOk = response1.status === 201 && (changeSet1?.resumen?.totalNuevos ?? 0) === 1 && plan1?.operations?.[0]?.type === 'CREATE_DOCUMENT' && (execution1?.documentosCreados ?? 0) === 1 && session1?.estado === 'COMPLETED';
        if (!createOk) {
            printFailure('CASE1', 'CREATE_DOCUMENT', { status: response1.status, body: body1 }, new Error('Case 1 failed').stack || '');
            throw new Error('CASE1');
        }
        const prismaDoc1 = await getPrismaDocument('DOC-TEST-001');
        if (!prismaDoc1 || prismaDoc1.nombre !== 'Documento test 1' || prismaDoc1.version !== '1.0') {
            printFailure('CASE1-PRISMA', { nombre: 'Documento test 1', version: '1.0' }, { nombre: prismaDoc1?.nombre ?? null, version: prismaDoc1?.version ?? null }, new Error('Prisma verification failed').stack || '');
            throw new Error('CASE1-PRISMA');
        }
        createResult = 'PASS';
        console.log(`Resultado CREATE:${createResult}`);
        const case2Payload = {
            ...case1Payload,
            source: {
                ...case1Payload.source,
                documentos: [
                    {
                        codigoDocumento: 'DOC-TEST-001',
                        nombreDocumento: 'Documento test actualizado',
                        version: '2.0',
                    },
                ],
            },
        };
        const response2 = await postImport(case2Payload);
        const body2 = response2.body;
        const execution2 = body2?.executionResult;
        const plan2 = body2?.persistencePlan;
        const session2 = body2?.session;
        const updateOk = response2.status === 201 && plan2?.operations?.[0]?.type === 'UPDATE_DOCUMENT' && (execution2?.documentosActualizados ?? 0) === 1 && session2?.estado === 'COMPLETED';
        if (!updateOk) {
            printFailure('CASE2', 'UPDATE_DOCUMENT', { status: response2.status, body: body2 }, new Error('Case 2 failed').stack || '');
            throw new Error('CASE2');
        }
        const prismaDoc2 = await getPrismaDocument('DOC-TEST-001');
        if (!prismaDoc2 || prismaDoc2.nombre !== 'Documento test actualizado' || prismaDoc2.version !== '2.0') {
            printFailure('CASE2-PRISMA', { nombre: 'Documento test actualizado', version: '2.0' }, { nombre: prismaDoc2?.nombre ?? null, version: prismaDoc2?.version ?? null }, new Error('Prisma verification failed').stack || '');
            throw new Error('CASE2-PRISMA');
        }
        updateResult = 'PASS';
        console.log(`Resultado UPDATE:${updateResult}`);
        const case3Payload = {
            ...case2Payload,
            source: {
                ...case2Payload.source,
                documentos: [
                    {
                        codigoDocumento: 'DOC-TEST-001',
                        nombreDocumento: 'Documento test actualizado',
                        version: '2.0',
                    },
                ],
            },
        };
        const response3 = await postImport(case3Payload);
        const body3 = response3.body;
        const execution3 = body3?.executionResult;
        const plan3 = body3?.persistencePlan;
        const session3 = body3?.session;
        const skipOk = response3.status === 201 && plan3?.operations?.[0]?.type === 'SKIP_DOCUMENT' && (execution3?.documentosCreados ?? 0) === 0 && (execution3?.documentosActualizados ?? 0) === 0 && session3?.estado === 'COMPLETED';
        if (!skipOk) {
            printFailure('CASE3', 'SKIP_DOCUMENT', { status: response3.status, body: body3 }, new Error('Case 3 failed').stack || '');
            throw new Error('CASE3');
        }
        const prismaDoc3 = await getPrismaDocument('DOC-TEST-001');
        if (!prismaDoc3 || prismaDoc3.nombre !== 'Documento test actualizado' || prismaDoc3.version !== '2.0') {
            printFailure('CASE3-PRISMA', { nombre: 'Documento test actualizado', version: '2.0' }, { nombre: prismaDoc3?.nombre ?? null, version: prismaDoc3?.version ?? null }, new Error('Prisma verification failed').stack || '');
            throw new Error('CASE3-PRISMA');
        }
        skipResult = 'PASS';
        console.log(`Resultado SKIP:${skipResult}`);
    }
    catch (error) {
        const stack = error instanceof Error ? error.stack || '' : String(error);
        console.log(`Resultado CREATE:${createResult}`);
        console.log(`Resultado UPDATE:${updateResult}`);
        console.log(`Resultado SKIP:${skipResult}`);
        if (stack) {
            printFailure('TEST', 'SUCCESS', 'FAILED', stack);
        }
        process.exitCode = 1;
    }
    finally {
        let dbCleanResult = 'FAIL';
        try {
            await restorePrismaDocument(originalDocument);
            dbCleanResult = 'PASS';
            console.log(`Resultado DATABASE CLEAN:${dbCleanResult}`);
        }
        catch (restoreError) {
            const stack = restoreError instanceof Error ? restoreError.stack || '' : String(restoreError);
            console.log(`RESULTADO DATABASE CLEAN:FAIL`);
            printFailure('DATABASE_CLEAN', 'PASS', 'FAIL', stack);
        }
        const enginePass = createResult === 'PASS' && updateResult === 'PASS' && skipResult === 'PASS' && dbCleanResult === 'PASS';
        if (enginePass) {
            console.log('ENGINE PASS');
        }
        else {
            console.log('ENGINE FAIL');
            process.exitCode = 1;
        }
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test-import-engine.js.map