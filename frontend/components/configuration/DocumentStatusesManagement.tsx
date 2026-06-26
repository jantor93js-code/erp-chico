'use client';

import CatalogManagement from './CatalogManagement';
import { documentStatusesService } from '@/services/documentStatusesService';

export default function DocumentStatusesManagement() {
  return (
    <CatalogManagement
      title="Estados de Documentos"
      service={documentStatusesService}
      pluralName="estados de documentos"
      singularName="Estado de Documento"
    />
  );
}
