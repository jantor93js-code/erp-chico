export const pipelineSteps = [
  'Lectura',
  'Validación',
  'Snapshot BD',
  'Comparación',
  'Planificación',
  'Persistencia',
];

export const mockSummary = {
  nuevos: 1,
  actualizados: 1,
  sinCambios: 1,
  sinCodigo: 0,
};

export const mockDocuments = [
  {
    codigoDocumento: 'DOC-TEST-001',
    nombreDocumento: 'Documento test 1',
    version: '1.0',
    status: 'Sin cambios',
  },
  {
    codigoDocumento: 'DOC-TEST-002',
    nombreDocumento: 'Documento nuevo',
    version: '1.0',
    status: 'Nuevo',
  },
  {
    codigoDocumento: 'DOC-TEST-003',
    nombreDocumento: 'Documento actualizado',
    version: '2.0',
    status: 'Actualizado',
  },
];

export const mockDifferences = {
  'DOC-TEST-003': [
    { field: 'nombreDocumento', databaseValue: 'Documento antiguo', contractValue: 'Documento actualizado' },
    { field: 'version', databaseValue: '1.0', contractValue: '2.0' },
  ],
};
