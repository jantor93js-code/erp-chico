'use client';

import CatalogManagement from './CatalogManagement';
import { taskStatusesService } from '@/services/taskStatusesService';

export default function TaskStatusesManagement() {
  return (
    <CatalogManagement
      title="Estados de Tareas"
      service={taskStatusesService}
      pluralName="estados de tareas"
      singularName="Estado de Tarea"
    />
  );
}
