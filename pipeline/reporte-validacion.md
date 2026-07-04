# Informe de Validacion PMO — Biblioteca Documental

**Fecha de generacion:** 2026-07-04T02:07:05.424779+00:00  
**Fuente analizada:** `json-pmo.json`  
**Version del validador:** validador-1.0.0

---

## Resumen ejecutivo

Se analizaron **300 documentos** provenientes del Listado Maestro 2026, ya procesados por el Transformador y el Normalizador. El indice de **calidad documental** resultante es de **40.33%**, clasificado como **Requiere revision**.

| Indicador | Valor |
|---|---|
| Total de documentos | 300 |
| Documentos sin codigo | 177 |
| Codigos duplicados | 1 |
| Documentos sin nombre | 58 |
| Documentos sin version | 279 |
| Documentos sin fechas | 279 |
| Documentos sin tipo documental | 0 |
| **Calidad documental** | **40.33% — Requiere revision** |

## Metodologia del indice de calidad

Cada documento se evalua contra 10 criterios binarios (10 puntos cada uno): codigo presente, codigo unico, nombre presente, version presente, tipo documental valido, area presente, proceso presente, al menos un responsable, al menos una fecha, y estado presente. El puntaje de un documento es el porcentaje de criterios cumplidos; la calidad documental global es el promedio simple de todos los documentos.

| Rango | Clasificacion |
|---|---|
| 95% - 100% | Excelente |
| 85% - 94% | Buena |
| 70% - 84% | Aceptable |
| Menor a 70% | Requiere revision |

## Hallazgos por dominio

### Documentos

**Codigos duplicados detectados:**

| Codigo | Apariciones |
|---|---|
| PRO-PROY-01 | 2 |

### Areas

| Indicador | Valor |
|---|---|
| Total de ocurrencias (documentos con area) | 255 |
| Areas distintas | 66 |
| Areas vacias | 45 |
| Posibles duplicados por variacion de escritura | 2 |

**Ejemplos de variantes detectadas (misma clave, distinta escritura):**

- `profesional-comercial-senior` → Profesional Comercial (Senior), Profesional Comercial Senior
- `gestion-documental` → Gestion Documental, Gestión Documental

### Procesos

| Indicador | Valor |
|---|---|
| Total de ocurrencias (documentos con proceso) | 66 |
| Procesos distintos | 28 |
| Procesos vacios | 234 |

### Responsables

| Indicador | Valor |
|---|---|
| Responsables distintos | 67 |
| Documentos sin responsable | 239 |
| Posibles duplicados por variacion de escritura | 0 |

### Estados

Estados vacios: **300**

| Estado | Cantidad |
|---|---|

> Nota: los estados se muestran tal como vienen del Excel. El Validador no los mapea ni los interpreta; esa es responsabilidad de una etapa futura.

### Tipos documentales

Tipos desconocidos: **0**

| Tipo | Cantidad |
|---|---|
| FORMATO | 85 |
| PROCEDIMIENTO | 82 |
| MANUAL | 61 |
| INSTRUCTIVO | 61 |
| PROCESO | 6 |
| POLITICA | 5 |

### Catalogos

| Catalogo | Entradas | Claves repetidas | Claves vacias | Variantes inconsistentes |
|---|---|---|---|---|
| tiposDocumentales | 6 | 0 | 0 | 0 |
| areas | 66 | 0 | 0 | 2 |
| codigosArea | 62 | 0 | 0 | 3 |
| procesos | 28 | 0 | 0 | 0 |
| estados | 8 | 0 | 0 | 0 |
| responsablesActualizacion | 60 | 0 | 0 | 0 |
| responsablesRevision | 27 | 0 | 0 | 0 |

## Advertencias

- 177 documentos no tienen codigo y no podran importarse de forma trazable.
- 1 codigo(s) estan duplicados; deben resolverse antes de importar.
- 45 documentos no tienen area asignada.
- 234 documentos no tienen proceso asociado.
- 239 documentos no tienen ningun responsable asignado.
- 300 documentos no tienen estado.

## Documentos con menor puntaje de calidad

| Codigo | Hoja de origen | Puntaje | Checks fallidos |
|---|---|---|---|
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |
| (sin codigo) | 3 Procedimientos - Nor | 20.0% | codigoPresente, codigoUnico, nombrePresente, versionPresente, procesoPresente, tieneResponsable, tieneFecha, estadoPresente |

## Recomendaciones

- Asignar codigo unico a todos los documentos antes de continuar con el importador.
- Revisar y corregir manualmente los codigos duplicados en el Excel de origen (el Validador no los modifica).
- Completar area y proceso en los documentos que quedaron sin esa informacion, para permitir su vinculacion relacional.
- Definir responsable de actualizacion o revision para los documentos que no tienen ninguno asignado.
- Revisar los documentos sin estado o con tipo documental no reconocido antes de definir el mapeo de estados del PMO.
- Unificar la escritura de areas y responsables que hoy generan variantes (mayusculas, tildes, espacios) para evitar catalogos fragmentados.
- Priorizar la revision de los documentos con menor puntaje (ver tabla anterior) antes de ejecutar el Importador definitivo.

---

*Este informe fue generado automaticamente por el Validador PMO. No modifica datos ni corrige informacion; su unico proposito es evaluar si el `json-pmo.json` esta listo para el Importador definitivo.*