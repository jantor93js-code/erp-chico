# Auditoria Funcional PMO — Biblioteca Documental

**Fecha de generacion:** 2026-07-03T23:17:43.996892+00:00  
**Documentos analizados:** 300  
**Version del auditor:** auditor-funcional-1.0.0

> Este informe complementa al Validador Tecnico. Mientras el Validador confirma que el JSON esta bien formado, esta Auditoria evalua si la informacion es funcionalmente util para operar un PMO.

---

## Resumen ejecutivo

La biblioteca documental analizada contiene **300 documentos**. La calidad estructural (¿pueden importarse?) es **80.6% — Aceptable**. La completitud documental (¿que tan llenos estan los campos?) es **12.33% — Critica**. La preparacion relacional (¿pueden vincularse a catalogos del PMO?) es **60.89% — Critica**. El nivel de madurez documental promedio es **1.38 de 5**, y solo **4.0%** de los documentos estan listos para auditoria (Nivel 5).

| Dimension | Pregunta que responde | Resultado | Clasificacion |
|---|---|---|---|
| Calidad estructural | ¿Los documentos pueden importarse? | 80.6% | Aceptable |
| Calidad documental | ¿Que tan completos estan los documentos? | 12.33% | Critica |
| Calidad relacional | ¿Que tan preparados estan los documentos para integrarse al PMO? | 60.89% | Critica |
| Madurez documental (promedio) | ¿Que tan maduro es el ciclo de vida documental? | 1.38 / 5 | — |

## Fortalezas

- El tipo documental esta correctamente identificado en casi todos los documentos (heredado automaticamente del nombre de hoja).
- No se detectaron variantes ortograficas relevantes en los nombres de responsables.
- La estructura basica de identificacion (codigo, nombre, tipo, area, estado) tiene una cobertura aceptable o superior.

## Debilidades

- La completitud documental es baja (12.33%): muchos documentos carecen de version, fechas o responsables.
- Solo el 22.0% de los documentos tiene un proceso asociado, lo que limita severamente la trazabilidad por proceso.
- Apenas el 4.0% de los documentos alcanza el nivel de madurez maximo (listo para auditoria).
- Existen hallazgos de severidad Critica que deben resolverse antes de continuar el pipeline.

## Hallazgos funcionales

| Severidad | Categoria | Tipo de problema | Hallazgo |
|---|---|---|---|
| Critico | Codigos duplicados | Calidad de datos | Existen codigos de documento duplicados |
| Alto | Modelo de datos: Area vs Cargo | Modelo documental | La columna 'Area' parece mezclar cargos con unidades organizacionales |
| Alto | Responsables sobrecargados | Organizacional (detectable por los datos) | Uno o mas responsables concentran una cantidad desproporcionada de documentos |
| Alto | Documentos sin codigo | Calidad de datos | Hay documentos sin codigo asignado |
| Alto | Documentos sin responsable | Calidad de datos | Un porcentaje relevante de documentos no tiene responsable asignado |
| Medio | Catalogo de Estados | Catalogacion | Existen estados con nombres muy similares que podrian representar el mismo concepto |
| Medio | Procesos sin documentos asociados | Organizacional (detectable por los datos) | Existen procesos definidos que ningun documento referencia |
| Medio | Patron de codigo - FORMATO | Catalogacion | Los codigos de tipo FORMATO no siguen un prefijo consistente |
| Medio | Documentos sin estado | Calidad de datos | Hay documentos sin estado documental |
| Bajo | Responsables con baja cobertura | Organizacional (detectable por los datos) | La mayoria de los responsables solo aparece en un documento |
| Bajo | Tipos documentales poco utilizados | Organizacional (detectable por los datos) | Algunos tipos documentales representan una fraccion minima del total |
| Bajo | Variantes ortograficas en Areas | Catalogacion | Existen variantes de escritura para el mismo valor en Areas |

### Detalle de hallazgos

**[Critico] Existen codigos de documento duplicados**  
*Categoria:* Codigos duplicados — *Tipo de problema:* Calidad de datos

1 codigo(s) estan duplicados. Un codigo duplicado rompe la unicidad requerida para importar y para cualquier trazabilidad posterior del documento.

Evidencia:
  - PRO-PROY-01 (2 apariciones)

**[Alto] La columna 'Area' parece mezclar cargos con unidades organizacionales**  
*Categoria:* Modelo de datos: Area vs Cargo — *Tipo de problema:* Modelo documental

53 de 68 valores distintos de 'area' (77.9%) contienen palabras propias de un cargo/rol (ej. Gerente, Coordinador, Analista) en vez de una unidad organizacional. Esto sugiere que la columna del Excel se uso indistintamente para 'Area / Cargo', lo cual complicara construir un catalogo limpio de Areas.

Evidencia:
  - Analista
  - Analista Administrativo
  - Analista Comercial
  - Analista Control de Trafico
  - Analista Licitaciones
  - Analista Mantenimiento
  - Analista Programador Logistico
  - Analista Proyectos Especiales
  - Analista RRHH
  - Analista SIG

**[Alto] Uno o mas responsables concentran una cantidad desproporcionada de documentos**  
*Categoria:* Responsables sobrecargados — *Tipo de problema:* Organizacional (detectable por los datos)

El promedio de documentos por responsable es 1.8. Se detectaron 5 responsable(s) muy por encima de ese promedio, lo que representa un riesgo de dependencia de una sola persona para mantener la biblioteca documental.

Evidencia:
  - Gerencia General: 7 documentos
  - Director Adm. y Financiera: 7 documentos
  - Coordinador Operaciones: 6 documentos
  - Coordinador Proyectos: 6 documentos
  - Director Comercial: 5 documentos

**[Alto] Hay documentos sin codigo asignado**  
*Categoria:* Documentos sin codigo — *Tipo de problema:* Calidad de datos

177 de 300 documentos (59.0%) no tienen codigo. No podran importarse de forma trazable mientras no se les asigne uno.

**[Alto] Un porcentaje relevante de documentos no tiene responsable asignado**  
*Categoria:* Documentos sin responsable — *Tipo de problema:* Calidad de datos

239 de 300 documentos (79.7%) no tienen responsable de actualizacion ni de revision. Sin responsable, el PMO no puede operar el ciclo de vida del documento (quien lo actualiza, quien lo aprueba).

**[Medio] Existen estados con nombres muy similares que podrian representar el mismo concepto**  
*Categoria:* Catalogo de Estados — *Tipo de problema:* Catalogacion

Se detectaron 2 par(es) de estados con alta similitud textual (distintos del catalogo, no simples variantes de escritura). Antes de mapear los estados al PMO, conviene confirmar con el negocio si representan lo mismo.

Evidencia:
  - 'Borrador' ~ 'En Borrador' (similitud 0.84)
  - 'Para revision directiva' ~ 'Para revison de Ing Ivon' (similitud 0.72)

**[Medio] Existen procesos definidos que ningun documento referencia**  
*Categoria:* Procesos sin documentos asociados — *Tipo de problema:* Organizacional (detectable por los datos)

2 de 2 procesos definidos en la hoja de Procesos no aparecen como 'Proceso Asociado' en ningun manual, procedimiento, instructivo, formato o politica. Puede indicar procesos definidos formalmente pero sin documentacion operativa desarrollada aun.

Evidencia:
  - Gobierno corporativo
  - Listado de radicacion de correspondencia

**[Medio] Los codigos de tipo FORMATO no siguen un prefijo consistente**  
*Categoria:* Patron de codigo - FORMATO — *Tipo de problema:* Catalogacion

El prefijo predominante para FORMATO es 'FOR' (12 de 26 documentos), pero 14 codigo(s) (53.8%) usan un prefijo distinto.

Evidencia:
  - MZ-CI-01-0A
  - MZ-LOGA-01
  - MZ-LOGO-01
  - MZ-LOGO-02
  - MZ-SIG-07
  - PRO-LOGA-01
  - PRO-LOGO-01
  - PRO-LOGO-02
  - PRO-LOGO-04
  - PRO-LOGO-05

**[Medio] Hay documentos sin estado documental**  
*Categoria:* Documentos sin estado — *Tipo de problema:* Calidad de datos

9 documentos no tienen estado registrado en el Excel.

**[Bajo] La mayoria de los responsables solo aparece en un documento**  
*Categoria:* Responsables con baja cobertura — *Tipo de problema:* Organizacional (detectable por los datos)

44 de 67 responsables distintos (≥50%) estan vinculados a un unico documento. Esto puede ser normal en estructuras muy distribuidas, o puede indicar responsables capturados con variaciones de escritura que fragmentan al mismo responsable en varias entradas.

**[Bajo] Algunos tipos documentales representan una fraccion minima del total**  
*Categoria:* Tipos documentales poco utilizados — *Tipo de problema:* Organizacional (detectable por los datos)

Estos tipos documentales tienen muy pocos documentos respecto al total; vale la pena confirmar si es un tipo documental en construccion o si deberia fusionarse con otro.

Evidencia:
  - PROCESO: 6 documentos
  - POLITICA: 5 documentos

**[Bajo] Existen variantes de escritura para el mismo valor en Areas**  
*Categoria:* Variantes ortograficas en Areas — *Tipo de problema:* Catalogacion

Se detectaron 2 caso(s) donde el mismo concepto de areas esta escrito de mas de una forma (mayusculas, tildes, espacios), fragmentando el catalogo.

Evidencia:
  - profesional-comercial-senior: Profesional Comercial (Senior), Profesional Comercial Senior
  - gestion-documental: Gestion Documental, Gestión Documental

## Matriz de riesgo

| Severidad | Cantidad de hallazgos |
|---|---|
| Critico | 1 |
| Alto | 4 |
| Medio | 4 |
| Bajo | 3 |

## Madurez documental

| Nivel | Descripcion | Documentos | % |
|---|---|---|---|
| 0 | Nivel 0 - Registro incompleto | 58 | 19.33% |
| 1 | Nivel 1 - Documento minimo | 168 | 56.0% |
| 2 | Nivel 2 - Documento identificado | 10 | 3.33% |
| 3 | Nivel 3 - Documento controlado | 43 | 14.33% |
| 4 | Nivel 4 - Documento gestionado | 9 | 3.0% |
| 5 | Nivel 5 - Documento listo para auditoria | 12 | 4.0% |

**Reglas de clasificacion:**

- Nivel 0: Sin nombre.
- Nivel 1: Nombre + tipo documental.
- Nivel 2: Nivel 1 + codigo unico + area.
- Nivel 3: Nivel 2 + estado + proceso.
- Nivel 4: Nivel 3 + responsable + version.
- Nivel 5: Nivel 4 + al menos una fecha + vigencia.

## Estado general del proyecto

El indice combinado de las tres dimensiones estructurales/documentales/relacionales es **51.27%**, lo que ubica al proyecto en un estado **Critica** respecto a los estandares tipicos de implementacion de un PMO documental.

## Nivel de preparacion para importar

**No se recomienda ejecutar el Importador todavia.** Existen 1 hallazgo(s) de severidad Critica (por ejemplo, codigos duplicados) que deben resolverse primero.

## Roadmap recomendado

**Prioridad 1** — Corregir codigos duplicados (severidad maxima: Critico, 2 hallazgo(s) relacionado(s))
**Prioridad 2** — Completar responsables (severidad maxima: Alto, 3 hallazgo(s) relacionado(s))
**Prioridad 3** — Normalizar nombres de areas (severidad maxima: Alto, 3 hallazgo(s) relacionado(s))
**Prioridad 4** — Mapear estados (severidad maxima: Medio, 2 hallazgo(s) relacionado(s))
**Prioridad 5** — Completar metadatos (severidad maxima: Medio, 2 hallazgo(s) relacionado(s))

## Conclusion ejecutiva

La informacion actual refleja un proceso documental en construccion: el pipeline tecnico (Transformador, Normalizador, Validador) funciona correctamente, pero el contenido del Excel de origen todavia no cumple los estandares funcionales de un PMO maduro (madurez promedio 1.38/5). Se recomienda ejecutar el roadmap anterior, priorizando los hallazgos criticos y altos, antes de construir el Resolutor de Catalogos y el Importador definitivo.

---

*Este informe fue generado automaticamente por el Auditor Funcional PMO. No modifica datos ni corrige informacion; su unico proposito es interpretar la calidad funcional del `json-pmo.json` antes de una migracion documental.*