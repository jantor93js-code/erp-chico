require('ts-node/register/transpile-only');
const fs = require('fs');
const path = require('path');
const { ExcelReaderService } = require('./src/modules/pmo/import/services/excel-reader.service');
const { ExcelNormalizerService } = require('./src/modules/pmo/import/services/excel-normalizer.service');
const { ContractValidatorService } = require('./src/modules/pmo/import/services/contract-validator.service');

(async () => {
  const reader = new ExcelReaderService();
  const normalizer = new ExcelNormalizerService();
  const validator = new ContractValidatorService();
  const inputPath = path.resolve(__dirname, '..', 'pipeline', 'inputs', 'Listado_Maestro_2026__3_.xlsx');
  const outputPath = path.resolve(__dirname, 'tmp', 'normalized-contract.json');

  const excelResult = await reader.read(inputPath);
  const contract = normalizer.normalize(excelResult);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(contract, null, 2));

  const result = validator.validate(contract);
  const docs = contract.documentos || [];
  const missingDocProps = [];
  for (const field of ['codigoDocumento', 'nombreDocumento', 'tipoDocumento', 'area', 'proceso', 'version', 'estado', 'responsableActualizacion', 'responsableRevision', 'fechaCreacion', 'fechaRevision']) {
    const missing = docs.filter(d => !d[field]).length;
    if (missing) missingDocProps.push(`${field}: ${missing}`);
  }

  console.log(JSON.stringify({
    valid: result.valid,
    errors: result.errors,
    metadataKeys: Object.keys(contract.metadata || {}),
    catalogKeys: Object.keys(contract.catalogos || {}),
    documentCount: docs.length,
    missingDocProps,
    metadata: contract.metadata,
    catalogos: {
      areas: Array.isArray(contract.catalogos?.areas),
      procesos: Array.isArray(contract.catalogos?.procesos),
      tiposDocumentales: Array.isArray(contract.catalogos?.tiposDocumentales),
      estados: Array.isArray(contract.catalogos?.estados),
      responsablesActualizacion: Array.isArray(contract.catalogos?.responsablesActualizacion),
      responsablesRevision: Array.isArray(contract.catalogos?.responsablesRevision),
      codigosArea: Array.isArray(contract.catalogos?.codigosArea),
    },
  }, null, 2));
})().catch(err => {
  console.error(err);
  process.exit(1);
});
