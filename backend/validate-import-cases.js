const http = require('http');

function send(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3011,
        path: '/api/v1/pmo/import/run',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null, raw: data });
          } catch (error) {
            resolve({ status: res.statusCode, body: null, raw: data });
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  const cases = [
    {
      name: 'case1',
      payload: {
        source: {
          metadata: { fechaGeneracion: '2026-07-03', versionNormalizador: '1.0', versionTransformador: '1.0' },
          catalogos: { areas: [], procesos: [], tiposDocumentales: [], estados: [], responsablesActualizacion: [], responsablesRevision: [], codigosArea: [] },
          documentos: [{ codigoDocumento: 'DOC-VALID-001', nombreDocumento: 'Documento validado', version: '1.0' }],
        },
        tenantId: 'tenant-001',
        usuario: 'admin',
      },
    },
    {
      name: 'case2',
      payload: {
        source: {
          metadata: { fechaGeneracion: '2026-07-03', versionNormalizador: '1.0', versionTransformador: '1.0' },
          catalogos: { areas: [], procesos: [], tiposDocumentales: [], estados: [], responsablesActualizacion: [], responsablesRevision: [], codigosArea: [] },
          documentos: [{ codigoDocumento: 'DOC-VALID-001', nombreDocumento: 'Documento validado', version: '1.0' }],
        },
        tenantId: 'tenant-001',
        usuario: 'admin',
      },
    },
    {
      name: 'case3',
      payload: {
        source: { metadata: {}, catalogos: {}, documentos: [] },
        tenantId: 'tenant-001',
        usuario: 'admin',
      },
    },
    {
      name: 'case4',
      payload: { source: 'not-json', tenantId: 'tenant-001', usuario: 'admin' },
    },
    {
      name: 'case5',
      payload: {
        source: {
          metadata: { fechaGeneracion: '2026-07-03', versionNormalizador: '1.0', versionTransformador: '1.0' },
          catalogos: { areas: [], procesos: [], tiposDocumentales: [], estados: [], responsablesActualizacion: [], responsablesRevision: [], codigosArea: [] },
          documentos: [{ codigoDocumento: 'DOC-VALID-005', nombreDocumento: 'Doc usuario vacio', version: '1.0' }],
        },
        tenantId: 'tenant-001',
        usuario: '',
      },
    },
    {
      name: 'case6',
      payload: {
        source: {
          metadata: { fechaGeneracion: '2026-07-03', versionNormalizador: '1.0', versionTransformador: '1.0' },
          catalogos: { areas: [], procesos: [], tiposDocumentales: [], estados: [], responsablesActualizacion: [], responsablesRevision: [], codigosArea: [] },
          documentos: [{ codigoDocumento: 'DOC-VALID-006', nombreDocumento: 'Doc tenant inexistente', version: '1.0' }],
        },
        tenantId: 'tenant-inexistente',
        usuario: 'admin',
      },
    },
  ];

  const results = {};
  for (const currentCase of cases) {
    try {
      results[currentCase.name] = await send(currentCase.payload);
    } catch (error) {
      results[currentCase.name] = { error: String(error) };
    }
  }

  console.log(JSON.stringify(results, null, 2));
})();
