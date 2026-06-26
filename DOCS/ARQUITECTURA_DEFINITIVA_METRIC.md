# MÉTRIC 1.0 - ARQUITECTURA DEFINITIVA
## Sistema Integrado de Gestión + PMO (Sin Dependencia de Excel)

**Fecha**: 2026-06-25  
**Versión**: Diseño Arquitectónico  
**Estado**: Pendiente de Aprobación  

---

## TABLA DE CONTENIDOS

1. [Principios Rectores](#principios-rectores)
2. [Entidades Actuales](#entidades-actuales)
3. [Problemas Identificados](#problemas-identificados)
4. [Arquitectura Propuesta](#arquitectura-propuesta)
5. [Entidades Nuevas Propuestas](#entidades-nuevas-propuestas)
6. [Entidades a Eliminar](#entidades-a-eliminar)
7. [Campos Nuevos Requeridos](#campos-nuevos-requeridos)
8. [Relaciones Nuevas](#relaciones-nuevas)
9. [Catálogos del Sistema](#catálogos-del-sistema)
10. [Módulo de Configuración](#módulo-de-configuración)
11. [Sistema Documental Integrado](#sistema-documental-integrado)
12. [Flujo Operativo Completo](#flujo-operativo-completo)
13. [Diagrama de Arquitectura](#diagrama-de-arquitectura)
14. [Roadmap de Implementación](#roadmap-de-implementación)

---

## PRINCIPIOS RECTORES

### 1. Reemplazo Total del Excel
- MÉTRIC debe ser la única fuente de información.
- El Excel existe únicamente para migraciones iniciales o cargas excepcionales.
- Toda operación diaria debe realizarse dentro del sistema.

### 2. Sistema Integrado de Gestión (SIG)
- Integración de procesos, procedimientos, formatos y matrices.
- Trazabilidad completa de documentos y procesos.
- Control de versiones y ciclo de vida documental.

### 3. Gestión de Proyectos de Negocio (PMO)
- Planificación estratégica vinculada a operación.
- Seguimiento de iniciativas y proyectos de mejora.
- Vinculación entre estrategia y ejecución operativa.

### 4. Automatización y Flujos
- Flujos de aprobación documentales.
- Automatización de procesos operativos.
- Validaciones en tiempo real.

### 5. Auditoria y Cumplimiento
- Todas las acciones auditadas.
- Historial de cambios completo.
- Trazabilidad de responsabilidades.

---

## ENTIDADES ACTUALES

### Módulo ERP (Operación)

#### Comercial
- **Cliente**: Empresa que solicita servicios
- **Cotización**: Propuesta de servicio
- **Pedido**: Orden de servicio

#### Operaciones
- **Servicio**: Ejecución del pedido
- **Conductor**: Personal operativo
- **Vehículo**: Recurso de transporte
- **DetalleServicio**: Componentes del pedido
- **EvidenciaServicio**: Registros de ejecución

#### Legalizaciones
- **GastoOperativo**: Costos de operación

#### Financiero
- **Factura**: Documento de cobro
- **Pago**: Registro de ingresos

### Módulo PMO (Gestión Estratégica)

- **PmoClient**: Cliente PMO
- **PmoProgram**: Programa estratégico
- **PmoInitiative**: Iniciativa de mejora
- **PmoProject**: Proyecto de negocio
- **Task**: Actividades del proyecto
- **TaskComment**: Comentarios de tareas

### Sistema de Información

- **Document**: Biblioteca documental
- **User**: Usuarios del sistema
- **Role**: Roles y permisos
- **Tenant**: Empresa/organización

---

## PROBLEMAS IDENTIFICADOS

### Problema 1: PMO Desconectado de Operación
- PMO (Client, Program, Initiative, Project) es paralelo a ERP.
- No hay conexión orgánica entre estrategia y operación.
- Task es genérico, no está vinculado a operación.

**Impacto**: Duplicidad de información, inconsistencia, silos de datos.

---

### Problema 2: Sistema Documental Incompleto
- Document existe pero es una biblioteca básica.
- Falta gestión integral de ciclo de vida.
- No hay vinculación clara con procesos operativos.
- Faltan campos para clasificación y control.
- No hay relación con Áreas, Responsables, Versiones.

**Impacto**: Documentos dispersos, falta de control, no cumple función de SIG.

---

### Problema 3: Catálogos Ausentes
- Áreas: hardcoded en campos string.
- Procesos: no existe entidad.
- Tipos Documentales: enum limitado.
- Estados Documentales: campos string sin control.
- Responsables de Áreas: no existe asignación formal.

**Impacto**: Inconsistencia de datos, sin trazabilidad, sin reporting efectivo.

---

### Problema 4: Falta de Estructura Organizacional
- No existe jerarquía de Áreas.
- No existe asignación de responsables por Área.
- Roles y Áreas no están vinculados.
- No hay matriz de RACI formal.

**Impacto**: Confusión de responsabilidades, falta de segregación.

---

### Problema 5: Task Genérico sin Contexto Operativo
- Task no está relacionado con procesos.
- No hay vínculo con documentos (procedimientos, formatos).
- No hay vínculo con servicios/operaciones.

**Impacto**: Tasks descontextualizadas, sin trazabilidad operativa.

---

### Problema 6: Relaciones Incompletas
- Document vinculado solo a nivel PMO (client, program, initiative, project).
- Document no está vinculado a operación (Cliente ERP, Pedido, Servicio).
- Falta vínculo Document-Process, Document-Area.
- Falta vínculo Task-Document.

**Impacto**: Duplicidad de información, silos entre módulos.

---

### Problema 7: Importador como Herramienta Permanente
- Se diseñó como herramienta de trabajo diaria.
- Debería ser solo asistente de migración.
- Necesita restricciones de acceso.

**Impacto**: Tentación de usar Excel, dependencia del importador.

---

## ARQUITECTURA PROPUESTA

### Pilares Fundamentales

```
┌─────────────────────────────────────────────────────────────────┐
│                    MÉTRIC 1.0 - ARQUITECTURA PROPUESTA          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              NIVEL CONFIGURACIÓN & GOBIERNO              │  │
│  │  (Áreas, Procesos, Tipos Documentales, Estados, etc.)    │  │
│  └─────────────────────────────────────────────────────────┘  │
│           │                                      │              │
│           ▼                                      ▼              │
│  ┌─────────────────┐              ┌─────────────────────┐    │
│  │  SIG INTEGRADO  │              │  PMO / ESTRATEGIA   │    │
│  │                 │              │                     │    │
│  │ • Procedimientos│              │ • Programas         │    │
│  │ • Formatos      │              │ • Iniciativas       │    │
│  │ • Matrices      │              │ • Proyectos         │    │
│  │ • Instructivos  │              │ • Tasks             │    │
│  │ • Versiones     │              │ • Portafolio        │    │
│  │ • Adjuntos      │              │ • Seguimiento       │    │
│  └────────┬────────┘              └────────┬────────────┘    │
│           │                                │                   │
│           └────────────────┬───────────────┘                   │
│                            │                                   │
│                            ▼                                   │
│           ┌────────────────────────────────┐                  │
│           │   OPERACIÓN DIARIA (ERP)       │                  │
│           │                                │                  │
│           │ • Clientes                     │                  │
│           │ • Pedidos                      │                  │
│           │ • Servicios                    │                  │
│           │ • Facturación                  │                  │
│           │ • Seguimiento                  │                  │
│           │ • Reportes                     │                  │
│           └────────────────────────────────┘                  │
│                            │                                   │
│                            ▼                                   │
│           ┌────────────────────────────────┐                  │
│           │   INFORMACIÓN HISTÓRICA        │                  │
│           │   & AUDITORIA                  │                  │
│           └────────────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Integración Conceptual

1. **Configuración** sustenta todo (gobierno corporativo).
2. **SIG** define procesos y documentos normalizados.
3. **PMO** alinea iniciativas con SIG.
4. **Operación** ejecuta siguiendo SIG, genera Tasks de mejora.
5. **Feedback** cierra el ciclo (mejora continua).

---

## ENTIDADES NUEVAS PROPUESTAS

### 1. Area (Catálogo)
```
Nombre
Codigo
Descripcion
ResponsableId (FK → User)
SuperAreaId (FK → Area) [para jerarquía]
Estado
Activo
createdAt, updatedAt
```

**Propósito**: Administrar estructura organizacional.  
**Beneficio**: Clasificación consistente, segregación de responsabilidades.

---

### 2. Process (Catálogo)
```
Nombre
Codigo
Descripcion
AreaId (FK → Area)
PropietarioId (FK → User)
Estado
Activo
createdAt, updatedAt
```

**Propósito**: Registrar procesos de la organización.  
**Beneficio**: Mapeo de procesos, vinculación documental.

---

### 3. DocumentType (Cataloging - mejorar enum actual)
```
id (UUID)
Nombre
Codigo
Descripcion
Abreviatura
Activo
createdAt, updatedAt
```

**Propósito**: Tipos documentales controlados.  
**Beneficio**: Consistencia en clasificación.

---

### 4. DocumentStatus (Cataloging - mejorar enum actual)
```
id (UUID)
Nombre
Codigo
Descripcion
Color (para UI)
EsEstadoFinal (Boolean)
Activo
createdAt, updatedAt
```

**Propósito**: Estados documentales controlados.  
**Beneficio**: Flujos consistentes.

---

### 5. TaskStatus (Catálogo - mejorar enum actual)
```
id (UUID)
Nombre
Codigo
Descripcion
Color (para UI)
EsEstadoFinal (Boolean)
EsEstadoAbierto (Boolean)
Activo
createdAt, updatedAt
```

**Propósito**: Estados de tasks controlados.  
**Beneficio**: Flujos consistentes.

---

### 6. TaskType (Catálogo - mejorar enum actual)
```
id (UUID)
Nombre
Codigo
Descripcion
Activo
createdAt, updatedAt
```

**Propósito**: Tipos de tasks controlados.  
**Beneficio**: Clasificación consistente.

---

### 7. Priority (Catálogo)
```
id (UUID)
Nombre
Codigo
Descripcion
Valor (1-5)
Color (para UI)
Activo
createdAt, updatedAt
```

**Propósito**: Prioridades normalizadas.  
**Beneficio**: Comparabilidad entre elementos.

---

### 8. Frequency (Catálogo)
```
id (UUID)
Nombre
Codigo
Descripcion
Dias (para cálculos)
Activo
createdAt, updatedAt
```

**Propósito**: Frecuencias de revisión documental.  
**Beneficio**: Automatización de auditorías.

---

### 9. Position / Cargo (Catálogo)
```
id (UUID)
Nombre
Codigo
Descripcion
AreaId (FK → Area)
Activo
createdAt, updatedAt
```

**Propósito**: Posiciones organizacionales.  
**Beneficio**: Matriz RACI, segregación de funciones.

---

### 10. DocumentVersion (Nueva entidad)
```
id (UUID)
DocumentId (FK → Document)
VersionNumber (1, 2, 3...)
CodigoVersion (v1.0, v1.1, v2.0...)
Descripcion
ContenidoResumido
ResponsableAprobacionId (FK → User)
FechaAprobacion
EsVersionActual
Estado
createdAt, updatedAt
```

**Propósito**: Control de versiones de documentos.  
**Beneficio**: Auditoría, trazabilidad, validación de historiales.

---

### 11. DocumentAttachment (Nueva entidad)
```
id (UUID)
DocumentId (FK → Document)
VersionId (FK → DocumentVersion)
NombreArchivo
TipoArchivo (MIME)
TamanoArchivo
URLArchivo
DescripcionAdjunto
createdAt
```

**Propósito**: Almacenar adjuntos de documentos con versionado.  
**Beneficio**: Integración con S3/almacenamiento, historial de cambios.

---

### 12. DocumentAudit (Nueva entidad)
```
id (UUID)
DocumentId (FK → Document)
TipoAccion (CREACION, REVISION, APROBACION, CAMBIO_ESTADO, DISTRIBUCION)
UsuarioId (FK → User)
DescripcionAccion
FechaAccion
DetallesJSON (cambios realizados)
createdAt
```

**Propósito**: Auditoria completa de documentos.  
**Beneficio**: Cumplimiento, trazabilidad legal.

---

### 13. ProcessFlowStep (Nueva entidad)
```
id (UUID)
ProcessId (FK → Process)
Orden
Nombre
Descripcion
TipoActividad (MANUAL, AUTOMATICA, VALIDACION)
ResponsableAreaId (FK → Area)
DocumentReferenciaId (FK → Document)
PasoSiguiente_Exitoso (FK → ProcessFlowStep)
PasoSiguiente_Error (FK → ProcessFlowStep)
createdAt, updatedAt
```

**Propósito**: Mapeo detallado de pasos de procesos.  
**Beneficio**: Ejecución guiada, automatización, training.

---

### 14. TaskTemplate (Nueva entidad)
```
id (UUID)
Nombre
Codigo
Descripcion
TipoTarea (FK → TaskType)
Prioridad (FK → Priority)
DuracionEstimadaDias
DocumentoReferencia (FK → Document)
ProcesoReferencia (FK → Process)
CreatorId (FK → User)
Activo
createdAt, updatedAt
```

**Propósito**: Templates de tasks para ejecución repetitiva.  
**Beneficio**: Estandarización, eficiencia, reducción de errores.

---

### 15. Approval (Nueva entidad)
```
id (UUID)
DocumentId (FK → Document)
VersionId (FK → DocumentVersion)
SolicitadoA (FK → User)
EstadoAprobacion (PENDIENTE, APROBADO, RECHAZADO)
FechaSolicitud
FechaRespuesta
Comentario
createdAt, updatedAt
```

**Propósito**: Workflow de aprobaciones documentales.  
**Beneficio**: Flujos de control, responsabilidad clara.

---

### 16. DocumentDistribution (Nueva entidad)
```
id (UUID)
DocumentId (FK → Document)
VersionId (FK → DocumentVersion)
UserId (FK → User)
AreaId (FK → Area)
RolId (FK → Role)
FechaDistribucion
FechaAcuseRecibo
EsDistribucionGlobal (Boolean)
TipoDistribucion (INDIVIDUAL, AREA, ROL, GLOBAL)
createdAt, updatedAt
```

**Propósito**: Rastreo de distribución de documentos.  
**Beneficio**: Cumplimiento, capacitación, responsabilidad.

---

## ENTIDADES A ELIMINAR

### 1. ~~Cotización~~ (Evaluar)
**Situación**: Existe como modelo de datos pero podría ser estado de Pedido.  
**Decisión**: MANTENER (es flujo comercial diferente).  
**Razón**: Separación clara entre propuesta y orden.

### 2. ~~DetalleServicio~~ (Analizar)
**Situación**: Podría ser fusionado con Servicio.  
**Decisión**: MANTENER (permite múltiples ítems por pedido).

### 3. ~~Document~~ (REDISEÑAR completamente)
**Situación**: Existe pero incompleto.  
**Decisión**: REDISEÑAR (agregar campos, relaciones, versionado).  
**Cambios**: Ver "Sistema Documental Integrado".

---

## CAMPOS NUEVOS REQUERIDOS

### Document - Campos Adicionales

```javascript
// Clasificación
Clasificacion: String // CONFIDENCIAL, INTERNO, PUBLICO
CodigoDocumento: String // Código único normalizado
Abreviatura: String

// Vínculos Operacionales NUEVOS
ProcesoId: FK → Process
AreaResponsableId: FK → Area
ResponsableAreaCargo: String

// Control de Cambios
FechaProximaRevision: DateTime
FrecuenciaRevision: FK → Frequency
UltimaRevisionPor: FK → User
FechaUltimaRevision: DateTime

// Distribución
RequiereDistribucion: Boolean
DistribuidoA: JSON // {roles: [], areas: [], usuarios: []}

// Cumplimiento
ReferenciaLegal: String // Ley, norma, estándar
RequiereAcuseRecibo: Boolean

// Relaciones Operacionales NUEVAS
ClienteERPId: FK → Cliente (ERP)
PedidoId: FK → Pedido
ServicioId: FK → Servicio
```

---

### Task - Campos Adicionales

```javascript
// Contexto Operacional NUEVO
ProcesoId: FK → Process
DocumentoReferencia: FK → Document
ServicioRelacionado: FK → Servicio
PedidoRelacionado: FK → Pedido
AreaResponsable: FK → Area

// Control de Ciclo de Vida
FechaInicio: DateTime
FechaFinPlanificada: DateTime
FechaFinReal: DateTime
DuracionRealDias: Int
Varianza: Int

// Dependencias
TareaDependiente: FK → Task (Tarea bloqueadora)

// Esfuerzo y Recurso
EsfuerzoEstimadoHoras: Float
HorasReales: Float
RecursoAsignado: FK → User [puede ser múltiple]
```

---

### Process - Campos Adicionales

```javascript
// Documentación
DocumentoProcesoId: FK → Document
DocumentoInstructivo: FK → Document

// Métrica
MetricaProductividad: String
MetricaCalidad: String
MetricaCosto: String

// Contactos
ResponsablePrincipal: FK → User
ResponsableSecundario: FK → User
```

---

## RELACIONES NUEVAS

### Document

| Desde | Hacia | Tipo | Descripción |
|-------|-------|------|-------------|
| Document | Process | N:1 | Documento mapea proceso |
| Document | Area | N:1 | Responsable de área |
| Document | User | N:1 | Responsable individual |
| Document | Cliente (ERP) | N:1 | **NUEVA** - Vinculación operacional |
| Document | Pedido | N:1 | **NUEVA** - Soportes de pedido |
| Document | Servicio | N:1 | **NUEVA** - Evidencia de servicio |
| Document | Role | N:M | **NUEVA** - Roles que deben conocer |
| Document | Version | 1:M | Control de versiones |
| Document | Attachment | 1:M | Archivos adjuntos |
| Document | Audit | 1:M | Historial completo |
| Document | Approval | 1:M | Aprobaciones pendientes |
| Document | Distribution | 1:M | Distribuciones realizadas |

---

### Task

| Desde | Hacia | Tipo | Descripción |
|-------|-------|------|-------------|
| Task | Process | N:1 | **NUEVA** - Tarea de proceso |
| Task | Area | N:1 | **NUEVA** - Área responsable |
| Task | Document | N:M | **NUEVA** - Documentos referenciados |
| Task | Servicio | N:1 | **NUEVA** - Tarea de servicio |
| Task | Pedido | N:1 | **NUEVA** - Tarea de pedido |
| Task | TaskTemplate | N:1 | **NUEVA** - Creada desde template |
| Task | Task | N:M | **NUEVA** - Dependencias entre tasks |

---

### Process

| Desde | Hacia | Tipo | Descripción |
|-------|-------|------|-------------|
| Process | Area | N:1 | Área propietaria |
| Process | User | N:1 | Responsable del proceso |
| Process | Document | 1:M | **NUEVA** - Documentación del proceso |
| Process | FlowStep | 1:M | Pasos del proceso |

---

### Servicio / Pedido

| Desde | Hacia | Tipo | Descripción |
|-------|-------|------|-------------|
| Servicio | Document | N:M | **NUEVA** - Documentos/Evidencias |
| Servicio | Task | N:M | **NUEVA** - Tasks de ejecución |
| Pedido | Document | N:M | **NUEVA** - Soportes de pedido |
| Pedido | Process | N:1 | **NUEVA** - Proceso operativo |

---

## CATÁLOGOS DEL SISTEMA

### Catálogos a Crear (Módulo Configuración)

1. **Áreas** - Estructura organizacional
2. **Procesos** - Mapa de procesos
3. **Tipos Documentales** - Clasificación de documentos
4. **Estados Documentales** - Flujo de documentos
5. **Tipos de Task** - Categorización de actividades
6. **Estados de Task** - Flujo de tareas
7. **Prioridades** - Niveles de importancia
8. **Frecuencias** - Revisión documental
9. **Cargos/Posiciones** - Estructura de roles
10. **Clasificaciones** - Nivel de confidencialidad

### Catálogos Existentes a Mejorar

| Catálogo | Cambio | Razón |
|----------|--------|-------|
| Role | Agregar descripción | Mayor contexto |
| Role | Vincular con Process | Segregación operativa |
| Cliente (ERP) | Agregar AreaResponsable | Asignación clara |
| Conductor | Agregar Area, Cargo | Estructura organizacional |

---

## MÓDULO DE CONFIGURACIÓN

### Estructura Propuesta

```
Configuración (Módulo nuevo)
├── Sistema
│   ├── Tenant
│   ├── Usuarios
│   ├── Roles & Permisos
│   └── Auditoría
│
├── Catálogos
│   ├── Áreas
│   ├── Procesos
│   ├── Cargos/Posiciones
│   ├── Tipos Documentales
│   ├── Estados Documentales
│   ├── Tipos de Task
│   ├── Estados de Task
│   ├── Prioridades
│   ├── Frecuencias
│   └── Clasificaciones
│
└── Gobernanza
    ├── Estructura Organizacional (Jerarquía de Áreas)
    ├── Matriz RACI
    ├── Responsables por Área
    ├── Integrantes por Área
    └── Permisos por Función
```

---

## SISTEMA DOCUMENTAL INTEGRADO

### Visión

Un SIG que reemplace completamente el Excel de documentación. Gestión integral del ciclo de vida de:
- Procedimientos
- Instructivos
- Formatos
- Matrices
- Políticas
- Manuales
- Contratos
- Evidencias

### Funcionalidades Clave

#### 1. Versionado
- Cada cambio genera nueva versión.
- Historial completo.
- Rollback a versiones anteriores.
- Aprobación por versión.

#### 2. Ciclo de Vida
```
BORRADOR → PENDIENTE_APROBACION → VIGENTE → EN_REVISION → OBSOLETO → ARCHIVADO
```

#### 3. Aprobaciones
- Workflow de aprobación por rol.
- Comentarios en aprobación.
- Acuerdos y desacuerdos registrados.
- Escalamientos automáticos.

#### 4. Distribución
- Distribución a usuarios, áreas, roles.
- Acuse de recibo obligatorio.
- Capacitación vinculada.
- Historial de distribuciones.

#### 5. Auditoría
- Todas las acciones registradas (creación, cambio, aprobación).
- Usuario, fecha, descripción.
- Cambios de campos específicos.
- Exportación para auditorías.

#### 6. Vinculación Operacional
- Documento → Proceso
- Documento → Procedimiento (referencia)
- Documento → Formato (usa formularios del sistema)
- Documento → Evidencia (asociado a ejecución)
- Documento → Task (tarea de creación/revisión)

#### 7. Búsqueda y Descubrimiento
- Por nombre, código, proceso, área.
- Filtros avanzados.
- Tags/categorías.
- Documentos relacionados.

#### 8. Integración en Operación
- Al ejecutar servicio → documentos disponibles.
- Al crear task → documentos referenciados.
- Formularios basados en documentos.
- Cargas automáticas de documentos requeridos.

---

## FLUJO OPERATIVO COMPLETO

### Fase 1: Configuración Inicial (Una sola vez)

```
1. Administrador crea Catálogos
   ├── Áreas (Comercial, Operaciones, Legalizaciones, Financiero)
   ├── Procesos (Recepción, Planeación, Ejecución, Facturación)
   ├── Cargos (Gerente, Coordinador, Analista)
   ├── Tipos Documentales (Procedimiento, Instructivo, Formato)
   ├── Estados (VIGENTE, EN_REVISION, OBSOLETO)
   ├── Prioridades (BAJA, MEDIA, ALTA, CRÍTICA)
   └── Frecuencias (MENSUAL, TRIMESTRAL, ANUAL)

2. Administrador crea Estructura Organizacional
   ├── Jerarquía de Áreas
   ├── Asigna Responsables por Área
   ├── Define Integrantes
   └── Configura Matriz RACI

3. Administrador crea Procesos en Detalle
   ├── Define Pasos (ProcessFlowStep)
   ├── Asigna Responsables
   ├── Vincula Documentos (Procedimientos)
   ├── Define Validaciones
   └── Configura Automatizaciones

4. Administrador crea Templates de Documentos
   ├── Procedimiento estándar
   ├── Instructivo estándar
   ├── Formato estándar
   └── Matriz estándar
```

---

### Fase 2: Migración Inicial (Importación de Excel)

```
1. Usuario PMO importa Maestro de CHICO
   ├── Mapeo de Cliente CHICO → PmoClient
   ├── Mapeo de Iniciativas → PmoInitiatives
   ├── Mapeo de Proyectos → PmoProjects
   └── Mapeo de Tasks → Tasks

2. Usuario PMO importa Documentación Existente
   ├── Mapeo de Documentos Excel → Entidad Document
   ├── Asignación de Áreas responsables
   ├── Asignación de Procesos
   ├── Establecimiento de versión inicial
   └── Distribución a usuarios correspondientes

3. Usuario ERP importa Maestros Operacionales
   ├── Clientes ERP (si aplica)
   ├── Conductores
   ├── Vehículos
   └── Históricos (últimas 3 meses)

4. Validación
   ├── Integridad de datos
   ├── Relaciones correctas
   ├── Usuarios mapeados correctamente
   └── Sign-off de Gerencia
```

---

### Fase 3: Operación Diaria - Ciclo de Servicio

```
┌─ INICIO ─────────────────────────────────────────────────────┐
│                                                               │
│  ETAPA 1: RECEPCIÓN DE SOLICITUD (Ejecutivo Comercial)      │
│  ├─ Ejecutivo recibe solicitud de cliente                    │
│  ├─ Ejecutivo crea PEDIDO en MÉTRIC                          │
│  ├─ Sistema vincula automáticamente:                         │
│  │   ├─ Cliente (actual o nuevo)                             │
│  │   ├─ Proceso (Comercial → Recepción)                      │
│  │   ├─ Documentos disponibles (Procedimiento recepción)     │
│  │   └─ Crea Task autom. para análisis operativo             │
│  └─ Transición a siguiente etapa                             │
│                                                               │
│  ETAPA 2: ANÁLISIS DEL SERVICIO (Director Operaciones)      │
│  ├─ Director revisa Task asignada                            │
│  ├─ Consulta Procedimiento de Análisis en MÉTRIC            │
│  ├─ Analiza tipo de servicio (Mudanza, Transporte, etc.)    │
│  ├─ Sigue Flujo del Proceso (ProcessFlowStep)               │
│  ├─ Crea Task secundaria para Coordinador                    │
│  └─ Cierra Task de análisis                                  │
│                                                               │
│  ETAPA 3: PLANEACIÓN OPERATIVA (Coordinador Operaciones)   │
│  ├─ Coordinador ejecuta Task de planeación                   │
│  ├─ Consulta Documento: "Instructivo de Planeación"         │
│  ├─ Define:                                                  │
│  │   ├─ Recursos necesarios                                  │
│  │   ├─ Fechas tentativas                                    │
│  │   └─ Especificaciones                                     │
│  ├─ Sistema sugiere SERVICIO(s) basado en tipo              │
│  ├─ Crea Task para Asignación de Recursos                   │
│  └─ Aprueba plan (flujo de aprobación)                       │
│                                                               │
│  ETAPA 4: ASIGNACIÓN DE RECURSOS (Coordinador)             │
│  ├─ Consulta Procedimiento de Asignación                    │
│  ├─ Sistema sugiere vehículos/conductores disponibles       │
│  ├─ Asigna Vehículo → SERVICIO                              │
│  ├─ Asigna Conductor → SERVICIO                              │
│  ├─ Registra en MÉTRIC                                       │
│  └─ Crea Task para Control Preoperativo                     │
│                                                               │
│  ETAPA 5: CONTROL PREOPERATIVO (Inspector)                 │
│  ├─ Consulta Checklist (Formato en MÉTRIC)                 │
│  ├─ Verifica estado del vehículo                             │
│  ├─ Registra evidencias (fotos)                              │
│  ├─ Firma electrónica en MÉTRIC                              │
│  ├─ Sistema crea DOCUMENTO: "Reporte Preoperativo"          │
│  └─ Cierra Task                                              │
│                                                               │
│  ETAPA 6: EJECUCIÓN (Conductor + Operaciones)              │
│  ├─ Conductor accede a MÉTRIC (app móvil/web)              │
│  ├─ Visualiza Servicio asignado                              │
│  ├─ Sigue Procedimiento de Ejecución                        │
│  ├─ Registra estados: PROGRAMADO → DESPACHADO → EN_RUTA    │
│  ├─ Toma evidencias (fotos, ubicación GPS)                   │
│  ├─ Registra novedades/incidentes                            │
│  ├─ Marca como ENTREGADO                                    │
│  └─ Sistema crea DOCUMENTO: "Evidencia de Servicio"         │
│                                                               │
│  ETAPA 7: LEGALIZACIÓN (Analista Legalizaciones)           │
│  ├─ Sistema crea Task automáticamente                        │
│  ├─ Analista consulta:                                       │
│  │   ├─ Procedimiento de Legalización                       │
│  │   ├─ Formato de Gastos                                    │
│  │   └─ Checklist de documentación                           │
│  ├─ Registra Gastos Operativos en MÉTRIC                    │
│  ├─ Carga Evidencias (soportes)                              │
│  ├─ Sistema vincula DOCUMENTOS: "Soporte de Gasto"          │
│  ├─ Flujo de aprobación automático                           │
│  └─ Marca SERVICIO como LEGALIZADO                          │
│                                                               │
│  ETAPA 8: FACTURACIÓN (Usuario Financiero)                 │
│  ├─ Sistema sugiere servicios listos para facturación       │
│  ├─ Financiero crea FACTURA en MÉTRIC                      │
│  ├─ Sistema calcula automáticamente:                         │
│  │   ├─ Valor base (Pedido)                                  │
│  │   ├─ Gastos adicionales (GastoOperativo)                  │
│  │   └─ Impuestos                                            │
│  ├─ Genera DOCUMENTO: "Factura"                             │
│  ├─ Flujo de aprobación                                      │
│  └─ Marca PEDIDO como FACTURADO                             │
│                                                               │
│  ETAPA 9: CIERRE (Usuario Financiero)                       │
│  ├─ Cuando PAGO se registra completamente                    │
│  ├─ Sistema marca PEDIDO como CERRADO                       │
│  ├─ Genera DOCUMENTO: "Resumen de Cierre"                   │
│  ├─ Crea archivo PDF (Pedido + Servicios + Facturas)        │
│  └─ Envía notificación a Cliente                             │
│                                                               │
└─ FIN ───────────────────────────────────────────────────────┘
```

---

### Fase 4: Mejora Continua (Diaria)

```
OPERACIONES GENERA INSIGHTS
├─ Conductor reporta demora en proceso
│  ├─ Sistema sugiere: ¿Hay mejora en proceso?
│  └─ Crea Task: "Revisar Procedimiento de Despacho"
│
├─ Se identifica gasto anómalo
│  ├─ Sistema alerta
│  └─ Crea Task: "Analizar causa de gasto extra"
│
└─ Se completan 100 servicios exitosos
   ├─ Sistema identifica: proceso estable
   └─ Crea Task: "Documentar buenas prácticas"

TASKS DE MEJORA GENERAN CAMBIOS
├─ Se revisa Procedimiento de Despacho
├─ Se documenta cambio (nueva versión de Document)
├─ Se aprueba (flujo de aprobación)
├─ Se distribuye a usuarios (con acuse)
├─ Se crea capacitación (si es complejo)
└─ Se cierra Task de mejora

DASHBOARD REFLEJA MEJORAS
├─ KPI: Tiempo de despacho (disminuye)
├─ KPI: Costos operativos (se reducen)
└─ Visibilidad en PMO → cierre de iniciativas de mejora
```

---

## DIAGRAMA DE ARQUITECTURA

### Modelo Entidad-Relación (Simplificado)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         MÉTRIC 1.0 - MODELO INTEGRADO                    │
└──────────────────────────────────────────────────────────────────────────┘

                              NIVEL GOBERNANZA
                                     │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
      TENANT                      ROLE                      USER
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
     ┌─────────┐              ┌─────────┐              ┌──────────┐
     │  AREA   │              │ PROCESS │              │ CARGO    │
     └────┬────┘              └────┬────┘              └─────┬────┘
          │                        │                        │
          │                        │                        │
          └────────────┬───────────┴────────────┬───────────┘
                       │                        │
                       │                   ┌────────────┐
                       │                   │  DOCUMENT  │◄───────────┐
                       │                   └────┬───────┘            │
                       │                        │                    │
                   ┌───┴────────────────────────┴────────────────────┼───┐
                   │                                                  │   │
            ┌─────────────────────────────────────────────────┐  │   │
            │                   DOCUMENTACIÓN                 │  │   │
            │                                                 │  │   │
            │  DocumentVersion ──────┐                        │  │   │
            │  DocumentAttachment    ├──→ Document            │  │   │
            │  DocumentAudit         │                        │  │   │
            │  Approval              │                        │  │   │
            │  Distribution          │                        │  │   │
            └────────────┬───────────┴────────────────────────┘  │   │
                         │                                         │   │
         ┌───────────────┼──────────┬──────────────────────────────┤   │
         │               │          │                              │   │
    ┌────────┐      ┌────────┐  ┌──────┐                          │   │
    │  TASK  │      │ PROCESS│  │ AREA │  ◄─────────────────────────┘
    └────┬───┘      │  FLOW  │  │ RESP │
         │          │  STEP  │  └──────┘
         │          └────────┘
         │
         ├─ TaskComment
         ├─ TaskTemplate
         └─ Task Relacionado (N:M)

                   NIVEL OPERACIONAL
                           │
    ┌──────────────┬────────┼────────┬──────────────┐
    │              │        │        │              │
┌───────────┐ ┌─────────┐ ┌──────┐ ┌────────┐ ┌─────────┐
│  CLIENTE  │ │ PEDIDO  │ │SERVICIO│ │FACTURA│ │ PAGO    │
│  (ERP)    │ │         │ │        │ │       │ │         │
└─────┬─────┘ └────┬────┘ └───┬────┘ └───┬───┘ └─────────┘
      │            │          │          │
      │            │          │          │
      │      ┌─────┴──────────┴──────────┴──┐
      │      │   OBJETOS ASOCIADOS          │
      │      │                              │
      │      │  • DetalleServicio           │
      │      │  • GastoOperativo            │
      │      │  • EvidenciaServicio         │
      │      │  • Documento(s)              │
      │      │  • Task(s)                   │
      │      └──────────────────────────────┘
      │
      │      ┌──────────────────────────────┐
      │      │   PMO - ESTRATEGIA           │
      │      │                              │
      │      │  PmoClient                   │
      │      │  ├─ PmoProgram               │
      │      │  │  ├─ PmoInitiative         │
      │      │  │  │  └─ PmoProject         │
      │      │  │  │     └─ Task             │
      │      │  │  └─ Document(s)           │
      │      │  └─ Document(s)              │
      │      └──────────────────────────────┘
```

---

### Flujo de Datos

```
ENTRADA DE DATOS
    │
    ├─ Forma manual (Usuario crea en UI)
    ├─ Importación masiva (Excel → Importador)
    ├─ Automatización (Triggers de proceso)
    └─ Integración externa (API, webhooks)
         │
         ▼
  PROCESAMIENTO
    │
    ├─ Validación (Reglas de negocio)
    ├─ Enriquecimiento (Relaciones automáticas)
    ├─ Auditoría (Registro de acción)
    └─ Notificaciones (Tasks, alertas)
         │
         ▼
  ALMACENAMIENTO
    │
    ├─ Base de datos (PostgreSQL)
    ├─ Historial (DocumentAudit)
    └─ Adjuntos (S3/Almacenamiento externo)
         │
         ▼
  CONSUMO
    │
    ├─ UI Web (Dashboard, formularios, reportes)
    ├─ UI Móvil (Conductor, operativos)
    ├─ Reportes (PDF, Excel)
    ├─ Integraciones (APIs)
    └─ Auditoría (Logs, exportaciones)
         │
         ▼
  SALIDA DE DATOS
    │
    └─ Información para toma de decisiones
      ├─ KPIs operativos
      ├─ Reportes de cumplimiento
      ├─ Evidencias para clientes
      └─ Datos para mejora continua
```

---

## ROADMAP DE IMPLEMENTACIÓN

### Sprint 0: Planificación & Diseño (ACTUAL)
**Duración**: 1 semana  
**Entregables**:
- ✅ Documento arquitectónico (este documento)
- ✅ Aprobación de arquitectura
- ✅ Congelamiento de diseño

---

### Sprint 1: Infraestructura de Gobernanza
**Duración**: 2 semanas  
**Prioridad**: CRÍTICA  
**Dependencias**: Sprint 0

**Tareas**:
- [ ] Crear modelo de datos: Area, Process, Cargo, Frequency
- [ ] Crear modelo de datos: DocumentType, DocumentStatus (migrando de enum)
- [ ] Crear modelo de datos: TaskType, TaskStatus, Priority (migrando de enum)
- [ ] API CRUD: Áreas
- [ ] API CRUD: Procesos
- [ ] API CRUD: Cargos
- [ ] UI: Administración de Catálogos
- [ ] UI: Estructura organizacional (jerarquía de áreas)
- [ ] Seeding de catálogos iniciales
- [ ] Tests & Validación

**Bloquea**: Sprint 2, 3, 4, 5

---

### Sprint 2: Sistema Documental (Versionado & Control)
**Duración**: 3 semanas  
**Prioridad**: CRÍTICA  
**Dependencias**: Sprint 1

**Tareas**:
- [ ] Crear modelo: DocumentVersion
- [ ] Crear modelo: DocumentAttachment
- [ ] Crear modelo: DocumentAudit
- [ ] Ampliar Document: campos nuevos (Process, Area, etc.)
- [ ] API CRUD: Versioning
- [ ] API: Historial de cambios
- [ ] API: Rollback de versiones
- [ ] UI: Editor de documentos
- [ ] UI: Historial y versiones
- [ ] UI: Búsqueda de documentos
- [ ] Tests & Validación

**Bloquea**: Sprint 3, 4, 5

---

### Sprint 3: Sistema Documental (Aprobaciones & Distribución)
**Duración**: 2 semanas  
**Prioridad**: ALTA  
**Dependencias**: Sprint 2

**Tareas**:
- [ ] Crear modelo: Approval
- [ ] Crear modelo: DocumentDistribution
- [ ] API: Workflow de aprobaciones
- [ ] API: Distribución de documentos
- [ ] API: Acuse de recibo
- [ ] UI: Panel de aprobaciones pendientes
- [ ] UI: Distribución a usuarios/roles/áreas
- [ ] UI: Seguimiento de distribución
- [ ] Notificaciones (correo, in-app)
- [ ] Tests & Validación

**Bloquea**: Sprint 4, 5

---

### Sprint 4: Mapa de Procesos (ProcessFlowStep)
**Duración**: 2 semanas  
**Prioridad**: ALTA  
**Dependencias**: Sprint 1, 3

**Tareas**:
- [ ] Crear modelo: ProcessFlowStep
- [ ] API CRUD: Flow steps
- [ ] API: Navegación de pasos
- [ ] UI: Editor visual de procesos (canvas)
- [ ] UI: Visualización de flujos
- [ ] Integración con Documentos (vincular a pasos)
- [ ] Guía interactiva de procesos
- [ ] Tests & Validación

**Bloquea**: Sprint 6

---

### Sprint 5: Tasks Mejorados & Templates
**Duración**: 2 semanas  
**Prioridad**: ALTA  
**Dependencias**: Sprint 1, 3

**Tareas**:
- [ ] Ampliar Task: campos nuevos (Process, Area, Document, etc.)
- [ ] Crear modelo: TaskTemplate
- [ ] API: Crear tasks desde templates
- [ ] API: Dependencias entre tasks
- [ ] API: Gestión de duración real vs estimada
- [ ] UI: Asignación de tasks
- [ ] UI: Seguimiento de tasks
- [ ] UI: Dependencias visuales
- [ ] Notificaciones de vencimiento
- [ ] Tests & Validación

**Bloquea**: Sprint 6

---

### Sprint 6: Integración Operacional (Document + Operación)
**Duración**: 3 semanas  
**Prioridad**: CRÍTICA  
**Dependencias**: Sprint 2, 4, 5

**Tareas**:
- [ ] Vincular Document ↔ Pedido
- [ ] Vincular Document ↔ Servicio
- [ ] Vincular Document ↔ Cliente (ERP)
- [ ] Vincular Task ↔ Servicio
- [ ] Vincular Task ↔ Pedido
- [ ] UI: Documentos disponibles en Pedido
- [ ] UI: Documentos asociados en Servicio
- [ ] UI: Tasks de servicio
- [ ] Generación automática de DOCUMENTO: "Evidencia de Servicio"
- [ ] Tests & Validación

**Bloquea**: Sprint 7, 8

---

### Sprint 7: Automatizaciones & Flujos
**Duración**: 2 semanas  
**Prioridad**: MEDIA  
**Dependencias**: Sprint 6

**Tareas**:
- [ ] Crear Task automático al crear Pedido
- [ ] Crear Task automático al crear Servicio
- [ ] Crear Document automático al finalizar Servicio
- [ ] Crear DOCUMENTO automático al generar Factura
- [ ] Notificaciones automáticas
- [ ] Sugerencias automáticas (documentos, procesos)
- [ ] Tests & Validación

**Bloquea**: Sprint 8, 9

---

### Sprint 8: Importador Rediseñado (Solo Migración)
**Duración**: 2 semanas  
**Prioridad**: MEDIA  
**Dependencias**: Sprint 6

**Tareas**:
- [ ] Rediseñar importador (solo para migración)
- [ ] Mapeo inteligente: Excel → Entidades
- [ ] Validación de integridad
- [ ] Reporte de errores
- [ ] Rollback de importaciones fallidas
- [ ] UI: Asistente de migración
- [ ] Restricción de acceso (solo administradores)
- [ ] Auditoría de importaciones
- [ ] Tests & Validación

**Bloquea**: Sprint 9

---

### Sprint 9: Dashboard & Reportes
**Duración**: 2 semanas  
**Prioridad**: MEDIA  
**Dependencias**: Sprint 7, 8

**Tareas**:
- [ ] Dashboard: KPIs operativos (tiempo, costo, calidad)
- [ ] Dashboard: Estado de iniciativas PMO
- [ ] Dashboard: Documentos vencidos para revisión
- [ ] Reportes: Cumplimiento de procesos
- [ ] Reportes: Eficiencia operativa
- [ ] Reportes: Auditoría documental
- [ ] Exportación a Excel (datos, no edición)
- [ ] Tests & Validación

**Bloquea**: Sprint 10

---

### Sprint 10: Testing, Optimización & MVP 1.0
**Duración**: 2 semanas  
**Prioridad**: CRÍTICA  
**Dependencias**: Sprint 9

**Tareas**:
- [ ] Testing integral (UI, API, integración)
- [ ] Performance testing (500+K documentos)
- [ ] Security audit
- [ ] Load testing (100+ usuarios)
- [ ] UAT con usuarios clave
- [ ] Documentación de usuario
- [ ] Documentación de API
- [ ] Training de usuarios
- [ ] Go-live preparation
- [ ] Release MVP 1.0

---

## RESUMEN DE CAMBIOS

### Base de Datos

**Nuevas Tablas**: 16
- Area, Process, Cargo, Frequency
- DocumentType, DocumentStatus, TaskType, TaskStatus, Priority
- DocumentVersion, DocumentAttachment, DocumentAudit
- Approval, DocumentDistribution
- ProcessFlowStep, TaskTemplate

**Tablas Modificadas**: 5
- Document (5 campos nuevos)
- Task (6 campos nuevos)
- Process (2 campos nuevos)
- Servant... nuevas relaciones
- Pedido (nuevas relaciones)

**Tablas Eliminadas**: 0 (solo enums migrados a tablas)

---

### API

**Nuevos Endpoints**: 120+
- Catálogos CRUD (x10)
- Document versionado (x8)
- Aprobaciones (x6)
- Distribución (x6)
- Procesos (x6)
- ProcessFlowStep (x6)
- TaskTemplate (x6)
- Tasks mejorado (x8)
- Búsqueda avanzada (x4)
- Reportes (x10)

---

### Frontend

**Nuevas Páginas**: 15+
- Administración de Catálogos
- Gestión de Documentos
- Editor de Documentos
- Histórico de Versiones
- Panel de Aprobaciones
- Gestión de Procesos (visual)
- Templates de Tasks
- Dashboard de Cumplimiento
- Reportes
- Auditoría

**Componentes Reutilizables**: 20+
- Editor de Rich Text
- Timeline (versiones, auditoría)
- Workflow visual
- Approval workflow
- Process flow canvas
- Task dependency diagram

---

### Impacto Operacional

| Aspecto | Antes | Después | Beneficio |
|---------|-------|---------|-----------|
| Fuente de información | Excel + MÉTRIC | MÉTRIC únicamente | 1 fuente de verdad |
| Control de documentos | Manual, Excel | Automático, versionado | Cumplimiento |
| Trazabilidad | Limitada | Completa (auditoría) | Regulatorio |
| Procesos | Descritos, no seguidos | Mapeados, guiados | Estandarización |
| Integración PMO-Operación | Nula | Orgánica | Alineación estratégica |
| Mejora continua | Ad-hoc | Sistemática (Tasks) | Evolución sostenible |
| Tiempo de búsqueda | Horas | Segundos | Eficiencia |
| Formatos | Excel + MÉTRIC | MÉTRIC (formularios) | Integridad |
| Capacitación | Manual | Digital, en sistema | Accesibilidad |

---

## APÉNDICE: PREGUNTAS CLAVE PARA REVISIÓN

### 1. Sistema Documental
- [ ] ¿Será necesario integración con sistemas externos de gestión documental (SharePoint, etc.)?
- [ ] ¿Se requiere OCR para documentos escaneados?
- [ ] ¿Hay documentos que requieren firma digital (certificado)?
- [ ] ¿Es necesario control de acceso a nivel de documento?

### 2. Procesos
- [ ] ¿Se mapeará cada proceso existente antes de go-live?
- [ ] ¿Qué nivel de detalle requiere ProcessFlowStep?
- [ ] ¿Se utilizarán automatizaciones BPM o solo guías?

### 3. Catálogos
- [ ] ¿Hay más catálogos requeridos además de los propuestos?
- [ ] ¿Se requiere versionado de catálogos?
- [ ] ¿Hay categorización jerárquica adicional?

### 4. Integraciones
- [ ] ¿Se requiere integración con sistemas contables?
- [ ] ¿Se necesita webhook para notificaciones a Slack, Teams, etc.?
- [ ] ¿Hay APIs externas a consumir?

### 5. Performance
- [ ] ¿Cuántos documentos se espera albergar (1 año)?
- [ ] ¿Tiempo de búsqueda máximo aceptable?
- [ ] ¿Frecuencia de backup?

### 6. Gobernanza
- [ ] ¿Quién aprueba cambios de procesos?
- [ ] ¿Quién administra catálogos?
- [ ] ¿Hay segregación de funciones requerida (compliance)?

---

## PRÓXIMOS PASOS

1. **Revisión de Arquitectura**: Retroalimentación del equipo ejecutivo
2. **Validación de Catálogos**: Confirmar lista definitiva de catálogos
3. **Mapping de Procesos**: Detallar los 12 procesos operativos principales
4. **Definición de Roles**: Especificar permisos por rol en nuevo sistema
5. **Congelamiento**: Una vez aprobado, bloqueamos diseño e iniciamos Sprint 1

---

**Documento Preparado**: 2026-06-25  
**Estado**: Borrador - Pendiente Aprobación  
**Siguiente Revisión**: Tras feedback inicial
