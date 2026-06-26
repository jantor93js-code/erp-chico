'use client';

import CatalogManagement from './CatalogManagement';
import { documentTypesService } from '@/services/documentTypesService';

export default function DocumentTypesManagement() {
  return (
    <CatalogManagement
      title="Tipos de Documentos"
      service={documentTypesService}
      pluralName="tipos de documentos"
      singularName="Tipo de Documento"
    />
  );
}
