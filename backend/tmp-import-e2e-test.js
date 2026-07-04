const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

function readEnvDatabaseUrl() {
  const envPath = path.join(process.cwd(), '.env');
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const line = content.split(/\r?\n/).find(entry => entry.startsWith('DATABASE_URL='));
  if (!line) return process.env.DATABASE_URL;
  return line.split('=').slice(1).join('=').trim().replace(/^"|"$/g, '');
}

function sendRequest(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3010,
      path: '/api/v1/pmo/import/run',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null, raw: data });
        } catch (error) {
          resolve({ status: res.statusCode, body: null, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  const validPayload = {
    source: {
      metadata: { fechaGeneracion: '2026-07-03', versionNormalizador: '1.0', versionTransformador: '1.0' },
      catalogos: { areas: [], procesos: [], tiposDocumentales: [], estados: [], responsablesActualizacion: [], responsablesRevision: [], codigosArea: [] },
      documentos: [{ codigoDocumento: 'DOC-001', nombreDocumento: 'Documento de prueba', version: '1.0' }],
    },
    tenantId: 'tenant-001',
    usuario: 'admin',
  };

  const invalidContractPayload = {
    source: { metadata: {}, catalogos: {}, documentos: [] },
    tenantId: 'tenant-001',
    usuario: 'admin',
  };

  const emptyUserPayload = {
    source: {
      metadata: { fechaGeneracion: '2026-07-03', versionNormalizador: '1.0', versionTransformador: '1.0' },
      catalogos: { areas: [], procesos: [], tiposDocumentales: [], estados: [], responsablesActualizacion: [], responsablesRevision: [], codigosArea: [] },
      documentos: [{ codigoDocumento: 'DOC-002', nombreDocumento: 'Documento B', version: '1.0' }],
    },
    tenantId: 'tenant-001',
    usuario: '',
  };

  const duplicatePayload = {
    ...validPayload,
    source: {
      ...validPayload.source,
      documentos: [{ codigoDocumento: 'DOC-001', nombreDocumento: 'Documento duplicado', version: '1.1' }],
    },
  };

  const results = {};
  results.valid = await sendRequest(validPayload);
  results.invalidContract = await sendRequest(invalidContractPayload);
  results.emptyUser = await sendRequest(emptyUserPayload);
  results.duplicate = await sendRequest(duplicatePayload);
  console.log(JSON.stringify(results, null, 2));

  const databaseUrl = readEnvDatabaseUrl();
  const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  try {
    await prisma.$connect();
    const row = await prisma.document.findFirst({
      where: { codigo: 'DOC-001' },
      select: { id: true, codigo: true, nombre: true, version: true, origenImportacion: true, activo: true },
    });
    console.log('DB_ROW', JSON.stringify(row));
  } finally {
    await prisma.$disconnect();
  }
})();
