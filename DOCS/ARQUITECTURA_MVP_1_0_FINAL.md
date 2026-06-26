# ARQUITECTURA MVP 1.0 FINAL
## MÉTRIC - Sistema Integrado de Gestión + PMO

**Fecha**: 2026-06-25  
**Versión**: Arquitectura Definitiva - Congelada  
**Criterio**: ¿Ayuda a reemplazar el Excel? → Sí = CORE | No = ENTERPRISE

---

## FILOSOFÍA

MÉTRIC es un sistema empresarial simple, elegante y escalable.

**NO es**: un ERP gigante, un BPM complejo, un gestor documental sofisticado.

**SÍ es**: una plataforma única que reemplaza completamente el Excel como herramienta de trabajo diario.

---

## ESTRUCTURA DE CAPAS

```
┌─────────────────────────────────────────────────────────────────┐
│                    MÉTRIC CORE v1.0                             │
│  (Lo que SÍ se implementa ahora)                                │
│                                                                 │
│  • Gobernanza básica (Áreas, Procesos, Catálogos)             │
│  • Sistema documental simple (crear, consultar, actualizar)   │
│  • PMO integrado (Cliente → Programa → Iniciativa → Proyecto) │
│  • Operación diaria (Pedidos, Servicios, Facturación)         │
│  • Tasks simples (asignación, seguimiento)                    │
│  • Importador de migración (una sola ejecución)               │
│  • Dashboard con KPIs                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              MÉTRIC ENTERPRISE v2.0+                            │
│  (Documentado, NO se implementa en MVP)                         │
│                                                                 │
│  • Versionado avanzado de documentos                           │
│  • Auditoría completa (quién, qué, cuándo, por qué)          │
│  • Workflow de aprobaciones                                   │
│  • Distribución documental (acusos de recibo)                │
│  • Motor de procesos (flow steps, automatizaciones)          │
│  • Plantillas de tareas reutilizables                        │
│  • Firma electrónica                                         │
│  • Notificaciones inteligentes                               │
│  • Reglas de negocio avanzadas                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## PARTE 1: MODELO DE DATOS CORE v1.0

### CAMBIOS AL SCHEMA ACTUAL

#### A. ENTIDADES A MANTENER (Sin cambios mayores)

##### GOBERNANZA
- **Tenant** ✅ - Multitenancy
- **User** ✅ - Usuarios del sistema
- **Role** ✅ - Roles y permisos

##### OPERACIÓN ERP
- **Cliente** ✅ - Clientes/empresas
- **Pedido** ✅ - Órdenes de servicio
- **Servicio** ✅ - Ejecución de pedidos
- **Conductor** ✅ - Personal operativo
- **Vehículo** ✅ - Recursos de transporte
- **GastoOperativo** ✅ - Costos de operación
- **DetalleServicio** ✅ - Ítems de pedido
- **EvidenciaServicio** ✅ - Registro de ejecución
- **Factura** ✅ - Facturas
- **Pago** ✅ - Ingresos
- **Cotización** ✅ - Cotizaciones

##### PMO
- **PmoClient** ✅ - Cliente PMO (diferente de Cliente ERP)
- **PmoProgram** ✅ - Programas estratégicos
- **PmoInitiative** ✅ - Iniciativas de mejora
- **PmoProject** ✅ - Proyectos

##### TAREAS Y COMENTARIOS
- **Task** ✅ - Actividades (simplificado)
- **TaskComment** ✅ - Comentarios en tareas

##### DOCUMENTACIÓN BÁSICA
- **Document** ⚠️ - Renovado (ver detalles)

---

#### B. ENTIDADES A AGREGAR (CORE v1.0)

##### 1. Area (Catálogo)
```prisma
model Area {
  id String @id @default(uuid()) @db.Uuid
  nombre String
  codigo String @unique
  descripcion String?
  responsableId String? @map("responsable_id") @db.Uuid
  estado String @default("ACTIVO")
  activo Boolean @default(true)

  responsable User? @relation(fields: [responsableId], references: [id])
  documentos Document[]
  tasks Task[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("areas")
}
```

**Propósito**: Administrar estructura organizacional.  
**Reemplaza**: Valores hardcoded en strings.  
**Beneficio**: Consistencia, reportes por área.

---

##### 2. Process (Catálogo)
```prisma
model Process {
  id String @id @default(uuid()) @db.Uuid
  nombre String
  codigo String @unique
  descripcion String?
  areaId String @map("area_id") @db.Uuid
  responsableId String? @map("responsable_id") @db.Uuid
  estado String @default("ACTIVO")
  activo Boolean @default(true)

  area Area @relation(fields: [areaId], references: [id])
  responsable User? @relation(fields: [responsableId], references: [id])
  documentos Document[]
  tasks Task[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("processes")
}
```

**Propósito**: Mapear procesos de la organización.  
**Reemplaza**: Procesos documentados solo en Excel.  
**Beneficio**: Referencia única, vinculación documental.

---

##### 3. DocumentTypeRef (Catálogo - migrar de enum)
```prisma
model DocumentTypeRef {
  id String @id @default(uuid()) @db.Uuid
  nombre String @unique
  codigo String @unique
  descripcion String?
  activo Boolean @default(true)

  documentos Document[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("document_types")
}
```

**Propósito**: Tipos documentales controlados.  
**Reemplaza**: Enum DocumentType (MANUAL, PROCEDIMIENTO, etc.).  
**Beneficio**: Administración dinámica, sin código.

---

##### 4. DocumentStatusRef (Catálogo - migrar de enum)
```prisma
model DocumentStatusRef {
  id String @id @default(uuid()) @db.Uuid
  nombre String @unique
  codigo String @unique
  descripcion String?
  activo Boolean @default(true)

  documentos Document[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("document_statuses")
}
```

**Propósito**: Estados documentales controlados.  
**Reemplaza**: Enum DocumentEstado (VIGENTE, EN_REVISION, etc.).  
**Beneficio**: Flujos consistentes, sin código.

---

##### 5. TaskStatusRef (Catálogo - migrar de enum)
```prisma
model TaskStatusRef {
  id String @id @default(uuid()) @db.Uuid
  nombre String @unique
  codigo String @unique
  descripcion String?
  activo Boolean @default(true)

  tasks Task[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("task_statuses")
}
```

**Propósito**: Estados de tareas controlados.  
**Reemplaza**: Enum TaskEstado.  
**Beneficio**: Flujos consistentes.

---

#### C. ENTIDADES A MODIFICAR

##### 1. Document (RENOVADO PARA CORE)
```prisma
model Document {
  id String @id @default(uuid()) @db.Uuid

  // Identificación
  codigo String? @unique
  nombre String
  descripcion String?

  // Clasificación
  typeId String? @map("type_id") @db.Uuid
  statusId String? @map("status_id") @db.Uuid
  
  // Vinculación organizacional
  areaId String? @map("area_id") @db.Uuid
  processId String? @map("process_id") @db.Uuid
  responsableId String? @map("responsable_id") @db.Uuid

  // Control de documento
  version String? @default("1.0")
  proximaRevision DateTime? @map("proxima_revision")
  activo Boolean @default(true)

  // Auditoría básica
  createdBy String? @map("created_by") @db.Uuid
  updatedBy String? @map("updated_by") @db.Uuid
  
  // Vinculación operacional
  clienteId String? @map("cliente_id") @db.Uuid
  pedidoId String? @map("pedido_id") @db.Uuid
  servicioId String? @map("servicio_id") @db.Uuid
  programId String? @map("program_id") @db.Uuid
  initiativeId String? @map("initiative_id") @db.Uuid
  projectId String? @map("project_id") @db.Uuid

  // URLs y adjuntos
  enlace String?
  origenImportacion Boolean @default(false)

  // Relaciones
  type DocumentTypeRef? @relation(fields: [typeId], references: [id])
  status DocumentStatusRef? @relation(fields: [statusId], references: [id])
  area Area? @relation(fields: [areaId], references: [id])
  process Process? @relation(fields: [processId], references: [id])
  responsable User? @relation("DocumentResponsable", fields: [responsableId], references: [id])
  
  cliente PmoClient? @relation(fields: [clienteId], references: [id])
  programa PmoProgram? @relation(fields: [programId], references: [id])
  iniciativa PmoInitiative? @relation(fields: [initiativeId], references: [id])
  proyecto PmoProject? @relation(fields: [projectId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([areaId])
  @@index([processId])
  @@index([clienteId])
  @@index([programId])
  @@map("documents")
}
```

**Cambios**:
- ✅ Eliminar campos hardcoded: proceso (string), area (string), responsable (string), responsableCargo
- ✅ Agregar: areaId (FK), processId (FK), version, proximaRevision
- ✅ Agregar: typeId (FK), statusId (FK) para reemplazar enums
- ✅ Migrar DocumentType enum → DocumentTypeRef tabla
- ✅ Migrar DocumentEstado enum → DocumentStatusRef tabla
- ✅ Agregar createdBy, updatedBy para auditoría básica
- ✅ Vincular a Servicio y Pedido (operacional)

---

##### 2. Task (SIMPLIFICADO)
```prisma
model Task {
  id String @id @default(uuid()) @db.Uuid
  codigo String @unique
  tenantId String @map("tenant_id") @db.Uuid

  // Contenido
  titulo String
  descripcion String?

  // Estado
  statusId String? @map("status_id") @db.Uuid
  prioridad TaskPrioridad @default(MEDIA)

  // Asignación
  responsableId String? @map("responsable_id") @db.Uuid
  creadorId String? @map("creador_id") @db.Uuid

  // Contexto
  processId String? @map("process_id") @db.Uuid
  projectId String? @map("project_id") @db.Uuid
  servicioId String? @map("servicio_id") @db.Uuid

  // Timeline
  fechaLimite DateTime? @map("fecha_limite")

  // Auditoría
  origenImportacion Boolean @default(false)
  fuente String? @default("MANUAL")

  // Relaciones
  tenant Tenant @relation(fields: [tenantId], references: [id])
  status TaskStatusRef? @relation(fields: [statusId], references: [id])
  responsable User? @relation("TaskResponsable", fields: [responsableId], references: [id])
  creador User? @relation("TaskCreador", fields: [creadorId], references: [id])
  process Process? @relation(fields: [processId], references: [id])
  proyecto PmoProject? @relation(fields: [projectId], references: [id])
  servicio Servicio? @relation(fields: [servicioId], references: [id])

  comentarios TaskComment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("pmo_tasks")
}
```

**Cambios**:
- ✅ Reemplazar TaskEstado enum → statusId (FK a TaskStatusRef)
- ✅ Eliminar tipo (string hardcoded)
- ✅ Eliminar area (string hardcoded)
- ✅ Agregar: processId, servicioId para contexto operacional
- ✅ Mantener: prioridad (simple)

---

##### 3. Servicio (AGREGAR RELACIONES)
```prisma
model Servicio {
  // ... campos existentes ...

  // Nuevas relaciones CORE
  tareas Task[] // Tareas de este servicio
}
```

---

##### 4. Pedido (AGREGAR RELACIONES)
```prisma
model Pedido {
  // ... campos existentes ...

  // Nuevas relaciones CORE
  procesos Process[]  // Mapeo del proceso que se ejecuta
}
```

---

#### D. ENTIDADES A ELIMINAR / DESAPARECER

- ❌ Enum `TaskEstado` (→ TaskStatusRef tabla)
- ❌ Enum `TaskPrioridad` (mantener, es simple)
- ❌ Enum `TaskTipo` (→ simplificar, no es necesario en CORE)
- ❌ Enum `DocumentType` (→ DocumentTypeRef tabla)
- ❌ Enum `DocumentEstado` (→ DocumentStatusRef tabla)
- ❌ Campos redundantes en Document (proceso, area, responsable como strings)
- ❌ Campos redundantes en Task (area como string)
- ❌ Campos redundantes en PmoProject (area como string)

---

#### E. RELACIONES NUEVAS EN CORE v1.0

| De | Hacia | Tipo | Descripción |
|----|-------|------|-------------|
| Document | Area | N:1 | Documento responsabilidad de área |
| Document | Process | N:1 | Documento documenta proceso |
| Document | DocumentTypeRef | N:1 | Tipo dinámico |
| Document | DocumentStatusRef | N:1 | Estado dinámico |
| Document | Servicio | N:1 | **NUEVA** - Evidencia/soporte de servicio |
| Document | Pedido | N:1 | **NUEVA** - Documentación de pedido |
| Task | Area | N:1 | **NUEVA** - Área responsable |
| Task | Process | N:1 | **NUEVA** - Tarea de proceso |
| Task | Servicio | N:1 | **NUEVA** - Tarea operativa |
| Task | TaskStatusRef | N:1 | Estado dinámico |
| Servicio | Task | 1:M | **NUEVA** - Tasks del servicio |
| Servicio | Area | N:1 | Área que ejecuta (NEW) |
| Area | Process | 1:M | Procesos del área |
| Area | User | N:1 | Responsable del área |
| Process | User | N:1 | Responsable del proceso |
| Process | Area | N:1 | Área propietaria |

---

### CATÁLOGOS EN CORE v1.0

```
Configuración
├── Áreas (Area)
├── Procesos (Process)
├── Tipos Documentales (DocumentTypeRef)
├── Estados Documentales (DocumentStatusRef)
├── Estados de Tareas (TaskStatusRef)
└── Gestión de Roles (Role)
```

**NO agregar en CORE**:
- Cargos (→ ENTERPRISE v2.0)
- Prioridades (mantener enum simple)
- Frecuencias (→ ENTERPRISE v2.0)
- Clasificaciones (→ ENTERPRISE v2.0)

---

### RESUMEN: CAMBIOS AL SCHEMA PRISMA

**Nuevas Tablas**: 5
- Area
- Process
- DocumentTypeRef (migrar enum)
- DocumentStatusRef (migrar enum)
- TaskStatusRef (migrar enum)

**Tablas Modificadas**: 3
- Document (ampliar, cambiar relaciones)
- Task (cambiar enums a FK)
- Servicio (agregar FK a Area, relación a Task)

**Enums Eliminados**: 3
- TaskEstado → TablaStatusRef
- DocumentType → DocumentTypeRef
- DocumentEstado → DocumentStatusRef

**Enums Mantenidos**: 1
- TaskPrioridad (simple, no vale la pena tablificar)

**Campos Eliminados**: 7
- Document.proceso (string)
- Document.area (string)
- Document.responsable (string)
- Document.responsableCargo (string)
- Task.area (string)
- Task.tipo (string/enum)
- PmoProject.area (string)

**Campos Agregados**: 12
- Document.typeId, statusId, areaId, processId, version, proximaRevision, createdBy, updatedBy, servicioId
- Task.statusId, processId, servicioId
- Servicio.areaId

**Nuevas Relaciones**: 11 (ver tabla anterior)

---

## PARTE 2: MÓDULOS Y FUNCIONALIDADES CORE v1.0

### 1. CONFIGURACIÓN

**Objetivo**: Administrar catálogos y gobernanza básica.

**Módulos**:
- Administración de Áreas (CRUD + responsables)
- Administración de Procesos (CRUD + vinculación con Áreas)
- Administración de Tipos Documentales (CRUD)
- Administración de Estados Documentales (CRUD)
- Administración de Estados de Tareas (CRUD)

**Restricción**: Solo administradores.

---

### 2. SISTEMA DOCUMENTAL

**Objetivo**: Reemplazar Excel de documentación.

**Funcionalidades**:
- ✅ Crear documento (seleccionar tipo, área, proceso)
- ✅ Actualizar documento (campos básicos)
- ✅ Cambiar estado (VIGENTE → EN_REVISION → OBSOLETO)
- ✅ Vincular a procesos, áreas, responsables
- ✅ Vincular a Pedidos/Servicios como documentación
- ✅ Búsqueda por nombre, código, área, proceso
- ✅ Listado con filtros
- ✅ Establecer próxima revisión
- ✅ Carga de enlace o adjunto externo

**NO en CORE**:
- ❌ Versionado (solo campo version simple)
- ❌ Historial de cambios
- ❌ Aprobaciones
- ❌ Distribución/acuses
- ❌ Auditoría completa

---

### 3. PMO

**Objetivo**: Gestión estratégica de iniciativas.

**Jerarquía**:
```
PmoClient
  ↓
PmoProgram
  ↓
PmoInitiative
  ↓
PmoProject
  ↓
Task
```

**Funcionalidades**:
- ✅ CRUD de cada nivel
- ✅ Asignación de responsables
- ✅ Seguimiento de avance (%)
- ✅ Estados (ACTIVO, CERRADO)
- ✅ Comentarios en tareas
- ✅ Listado de tareas asignadas

**Vinculación con Sistema Documental**:
- Proyecto puede tener documentos asociados
- Iniciativa puede tener documentos asociados
- Documentos pueden vincular proyectos/iniciativas

**NO en CORE**:
- ❌ Workflow de aprobaciones
- ❌ Dependencias complejas entre tareas
- ❌ Hitos/milestones
- ❌ Recursos por proyecto

---

### 4. OPERACIÓN DIARIA (ERP)

**Objetivo**: Gestión operativa completa.

**Funcionalidades Existentes** (mantener):
- ✅ Clientes: CRUD, contactos
- ✅ Pedidos: CRUD, cambio de estado
- ✅ Servicios: CRUD, asignación de recursos
- ✅ Conductores: CRUD
- ✅ Vehículos: CRUD
- ✅ Gastos: CRUD
- ✅ Facturas: CRUD, seguimiento de pago
- ✅ Pagos: CRUD

**Funcionalidades Nuevas en CORE v1.0**:
- ✅ Vincular documentos a Pedidos (soportes)
- ✅ Vincular documentos a Servicios (evidencias)
- ✅ Crear/asignar tasks durante ejecución
- ✅ Seguimiento de tareas operativas
- ✅ Ver proceso que se está ejecutando

**NO en CORE**:
- ❌ Automatizaciones complejas
- ❌ Flujos de aprobación de gastos
- ❌ Notificaciones automáticas
- ❌ Generación automática de documentos

---

### 5. IMPORTADOR (Solo Migración)

**Objetivo**: Migración única inicial de Excel.

**Restricción**: 
- Solo ejecutable por administradores.
- Una sola ejecución (o con validaciones estrictas).
- No es herramienta de trabajo diario.

**Funcionalidades**:
- ✅ Mapeo inteligente de columnas Excel → campos
- ✅ Validación de integridad
- ✅ Carga de: PmoClient, PmoProgram, PmoInitiative, PmoProject, Task
- ✅ Carga de: Cliente, Pedido, Servicio, Conductor (históricos)
- ✅ Carga de: Documentos (si existen en Excel)
- ✅ Reportes de errores
- ✅ Auditoria de qué se importó

**NO en CORE**:
- ❌ Importación repetitiva
- ❌ Integración continua
- ❌ Manejo de duplicados avanzado
- ❌ Sincronización bidireccional

---

### 6. DASHBOARD

**Objetivo**: Visibilidad operativa con datos existentes.

**KPIs CORE**:
- Servicios activos (por estado)
- Facturación mensual
- Cartera (pagos pendientes)
- Tareas por vencer
- Iniciativas en progreso

**Visualizaciones**:
- Gráficos simples (barras, líneas)
- Tablas de datos
- Indicadores numéricos
- Filtros básicos por fecha/cliente/área

**NO en CORE**:
- ❌ KPIs complejos
- ❌ Machine learning / predicciones
- ❌ Alertas automáticas
- ❌ Reportes parametrizados

---

## PARTE 3: ROADMAP CORE v1.0

**Duración Total**: 8 semanas (2 meses)

### Sprint 1: Catálogos (Semana 1-2)
- [ ] Crear tablas: Area, Process, DocumentTypeRef, DocumentStatusRef, TaskStatusRef
- [ ] API CRUD: Áreas, Procesos
- [ ] API CRUD: Tipos documentales, Estados documentales, Estados tareas
- [ ] UI: Administración de catálogos
- [ ] Seeding de catálogos iniciales

### Sprint 2: Sistema Documental (Semana 3-4)
- [ ] Migrar Document a nuevas relaciones
- [ ] API: CRUD documento con áreas/procesos
- [ ] API: Cambio de estado de documento
- [ ] API: Búsqueda avanzada (nombre, código, área, proceso)
- [ ] UI: Crear/editar/eliminar documentos
- [ ] UI: Listar documentos con filtros
- [ ] UI: Vincular documentos a Pedidos/Servicios

### Sprint 3: Integración Operacional (Semana 5-6)
- [ ] Agregar FK a Servicio/Pedido/Area
- [ ] Migrar Task a Task StatusRef
- [ ] Agregar relaciones: Task ↔ Process, Task ↔ Servicio
- [ ] API: CRUD mejorado para Task
- [ ] API: Listar tareas operativas
- [ ] UI: Asignar tasks en Servicios
- [ ] UI: Seguimiento de tasks

### Sprint 4: PMO Integrado (Semana 7)
- [ ] Validar entidades PMO (sin cambios mayores)
- [ ] UI: Proyectos con documentos vinculados
- [ ] API: Vincular documentos a Proyectos/Iniciativas
- [ ] UI: Listado de tasks PMO

### Sprint 5: Importador + Testing (Semana 8)
- [ ] Rediseñar importador (solo migración)
- [ ] Testing integral
- [ ] Dashboard básico
- [ ] Documentación
- [ ] Go-live CORE v1.0

---

## PARTE 4: ROADMAP ENTERPRISE v2.0+ (NO implementar)

### Funcionalidades ENTERPRISE
1. **Versionado Avanzado** - DocumentVersion + control de cambios
2. **Auditoría Completa** - DocumentAudit (quién, qué, cuándo)
3. **Aprobaciones** - Workflow de aprobación de documentos
4. **Distribución** - Rastreo de distribución a usuarios/roles
5. **Motor de Procesos** - ProcessFlowStep (pasos detallados)
6. **Automatizaciones** - Flujos automáticos (triggers, acciones)
7. **Plantillas** - TaskTemplate (reutilización)
8. **Firma Digital** - Aprobación con certificado
9. **Notificaciones** - Alertas inteligentes
10. **Catálogos Avanzados** - Cargo, Frequency, Priority (como tablas)

### Entidades ENTERPRISE (Documentadas, NO crear)
```
DocumentVersion - Control de versiones
DocumentAttachment - Archivos por versión
DocumentAudit - Historial de cambios
Approval - Workflow de aprobaciones
Distribution - Rastreo de distribución
ProcessFlowStep - Pasos de procesos
TaskTemplate - Plantillas de tareas
Frequency - Frecuencias de revisión
Cargo - Posiciones organizacionales
Priority - Prioridades normalizadas
```

### Cuándo Pasar a ENTERPRISE
- MVP v1.0 en producción exitoso
- Clientes piden más control de documentos
- Necesidad de automatizaciones complejas
- Escala: 100+ usuarios activos

---

## PARTE 5: DIFERENCIAS CLAVE CORE vs ENTERPRISE

| Aspecto | CORE v1.0 | ENTERPRISE v2.0 |
|--------|----------|-----------------|
| Versiones de Documento | Campo simple | Tabla DocumentVersion |
| Historial de Cambios | NO | Tabla DocumentAudit |
| Aprobaciones | NO | Tabla Approval |
| Distribución de Docs | NO | Tabla Distribution |
| Procesos | Catálogo simple | Mapa visual con steps |
| Automatizaciones | Manuales | Motor de flujos |
| Plantillas de Tasks | NO | Tabla TaskTemplate |
| Firma Digital | NO | Integración con certificado |
| Notificaciones | Básicas (UI) | Sistema inteligente |
| Auditoría Legal | NO | Completa con trazas |

---

## PARTE 6: VERIFICACIÓN FINAL

### ¿Ayuda a Reemplazar Excel?

| Funcionalidad | CORE | Razón |
|---------------|------|-------|
| Documentos centralizados | ✅ | Reemplaza archivo de documentación Excel |
| Búsqueda de documentos | ✅ | Más rápido que Excel |
| Vincular docs a operación | ✅ | Excel no lo hace |
| Gestión de procesos | ✅ | Mapa de procesos centralizado |
| PMO integrado | ✅ | Reemplaza Excel de iniciativas |
| Operación diaria | ✅ | Pedidos, servicios, facturación |
| Versionado avanzado | ❌ | ENTERPRISE - overkill para MVP |
| Auditoría legal | ❌ | ENTERPRISE - puede esperar |
| Aprobaciones | ❌ | ENTERPRISE - usarían email por ahora |
| Automatizaciones | ❌ | ENTERPRISE - después de MVP |

---

## PARTE 7: LISTA EXACTA DE CAMBIOS

### Cambios a Implementar (En orden)

#### Base de Datos (5 nuevas tablas)
1. [ ] Crear tabla `areas`
2. [ ] Crear tabla `processes`
3. [ ] Crear tabla `document_types`
4. [ ] Crear tabla `document_statuses`
5. [ ] Crear tabla `task_statuses`

#### Schema Prisma (Eliminar enums, agregar modelos)
1. [ ] Eliminar enum `TaskEstado` → crear model `TaskStatusRef`
2. [ ] Eliminar enum `DocumentType` → crear model `DocumentTypeRef`
3. [ ] Eliminar enum `DocumentEstado` → crear model `DocumentStatusRef`
4. [ ] Agregar model `Area`
5. [ ] Agregar model `Process`
6. [ ] Actualizar model `Document` (nuevos campos/relaciones)
7. [ ] Actualizar model `Task` (nuevos campos/relaciones)
8. [ ] Actualizar model `Servicio` (agregar relación a Area, Task)
9. [ ] Eliminar campos hardcoded en Document, Task, PmoProject
10. [ ] Agregar índices para performance

#### Migraciones Prisma
1. [ ] Crear migración para tablas nuevas
2. [ ] Crear migración para eliminar campos
3. [ ] Crear migración para cambiar tipos de campo

#### API Backend
1. [ ] CRUD: Area
2. [ ] CRUD: Process
3. [ ] CRUD: DocumentTypeRef, DocumentStatusRef, TaskStatusRef
4. [ ] CRUD: Document (actualizado)
5. [ ] CRUD: Task (actualizado)
6. [ ] CRUD: Servicio (actualizado)
7. [ ] Search: Documentos avanzado
8. [ ] Endpoints: Dashboard básico

#### Frontend
1. [ ] UI: Administración de Catálogos
2. [ ] UI: Crear/editar Documentos
3. [ ] UI: Listar Documentos con filtros
4. [ ] UI: Actualizar Documentos operacionales
5. [ ] UI: Tareas operativas
6. [ ] UI: Dashboard simple

---

## PARTE 8: CRITERIO DE ACEPTACIÓN

### MVP 1.0 Está Listo Cuando:

- ✅ Todas las 5 nuevas tablas creadas
- ✅ Schema Prisma congelado
- ✅ Se pueden administrar Áreas
- ✅ Se pueden administrar Procesos
- ✅ Se pueden crear/editar/eliminar Documentos
- ✅ Se pueden buscar Documentos
- ✅ Se pueden vincular Documentos a Pedidos/Servicios
- ✅ Se pueden crear/asignar Tasks operativas
- ✅ PMO funciona completo (sin cambios)
- ✅ Dashboard muestra KPIs básicos
- ✅ Importador funciona (migración única)
- ✅ Zero hardcoded strings en área/proceso/estado
- ✅ Testing completo
- ✅ Documentación actualizada

---

## APÉNDICE: NO HACER

### Absolutamente NO

```
❌ NO crear tablas para ENTERPRISE v2.0
❌ NO agregar DocumentVersion
❌ NO agregar DocumentAudit
❌ NO crear motor de procesos
❌ NO agregar workflow de aprobaciones
❌ NO crear notificaciones inteligentes
❌ NO agregar firma digital
❌ NO tablificar Priority (mantener enum)
❌ NO crear Frequency, Cargo, etc.
❌ NO hacer automatizaciones complejas
❌ NO tocar el importador hasta sprint final
❌ NO cambiar PMO (excepto vincular docs)
```

### Sí Hacer

```
✅ Crear 5 catálogos básicos
✅ Migrar enums a tablas (3)
✅ Agregar 2 nuevas entidades (Area, Process)
✅ Actualizar 3 entidades existentes
✅ Agregar relaciones simples
✅ Validar modelo antes de empezar
✅ Documentar cada cambio
```

---

## CONCLUSIÓN

### Filosofía CORE v1.0

**Simple**: 5 nuevas tablas, 3 enums migrados, sin complejidad.

**Pragmático**: Solo lo necesario para reemplazar Excel.

**Escalable**: Diseño permite ENTERPRISE después sin rediseños.

**Congelado**: No vuelven cambios arquitectónicos hasta v2.0.

### Después de Aprobar Este Documento

1. **Congelamiento**: Arquitectura definitiva, sin discusiones.
2. **Implementación**: 8 sprints de trabajo limpio.
3. **Go-Live**: MÉTRIC v1.0 sin dependencia de Excel.
4. **Roadmap ENTERPRISE**: Documentado para después.

---

**Documento Completado**: 2026-06-25  
**Estado**: LISTO PARA APROBACIÓN  
**Cambios Posteriores**: Requieren revisión formal de arquitectura
