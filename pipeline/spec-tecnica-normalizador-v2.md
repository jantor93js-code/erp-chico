# Especificación Técnica de Implementación
## Sprint: Cierre del Normalizador PMO (v2)

**Documento dirigido a:** Codex (agente de implementación de código)
**Autor:** Arquitectura de Software — Pipeline Documental PMO
**Estado:** Aprobado para implementación
**Regla general de ejecución:** este documento es prescriptivo. Donde exista ambigüedad no resuelta aquí, Codex debe detenerse y preguntar antes de decidir por su cuenta. No se debe improvisar naming, estructura, ni comportamiento no descrito explícitamente.

---

## 1. Objetivo del Sprint

Cerrar la versión 2 del Normalizador (`normalizador.py`) para que `json-pmo.json` deje de ser una copia estructurada del Excel y pase a representar el **modelo documental relacional** del PMO, corrigiendo las inconsistencias detectadas en la auditoría técnica previa.

Al finalizar el sprint:

- `codigoArea` debe ser una entidad relacional (`valor` / `valorClave` / `valorId`), igual que `area`, `proceso`, `tipoDocumental` y los responsables.
- El catálogo de procesos debe conciliarse con los documentos de tipo `PROCESO`, distinguiendo procesos **definidos** (existen como documento) de procesos **referenciados** (citados por otros documentos vía el campo `proceso`).
- El catálogo de responsables debe separarse por rol: `responsablesActualizacion` y `responsablesRevision`, ya no un catálogo combinado `responsables`.
- La metadata debe reorganizarse: lo que es información de la **ejecución del pipeline** (fechas, versiones) vive una sola vez en la metadata raíz; lo que es información **del documento** (hoja de origen, fila) vive en la metadata del documento. No debe haber valores idénticos repetidos en los 300 documentos.
- Debe existir versionado explícito tanto del Normalizador como del Transformador, visible en la metadata raíz de `json-pmo.json`.
- El patrón `valor` / `valorClave` / `valorId` se mantiene sin cambios para los campos que ya lo usan.
- **No** se reintroduce ningún bloque `origen` con el registro completo dentro de cada documento. La trazabilidad sigue resuelta por los artefactos del pipeline (`documentos-biblioteca.json`, `errores-importacion.json`, etc.), no por duplicación de datos.

---

## 2. Alcance

### 2.1 Dentro del alcance

- Modificar `normalizador.py` para implementar los 6 cambios aprobados (sección 3).
- Modificar `transformador.py` **únicamente** para agregar una constante de versión (ver sección 3.5). Ningún otro cambio a este archivo.
- Modificar `validador.py` **únicamente** en las funciones que leen la estructura de catálogos del Normalizador, para que sigan funcionando correctamente con el nuevo esquema (ver sección 5 y 7, Paso 6). Esto no es una mejora nueva: es un ajuste obligatorio de compatibilidad, porque cambiar el esquema de `json-pmo.json` sin ajustar `validador.py` provocaría que el Validador Técnico reporte datos incorrectos de forma silenciosa (sin error, sin excepción) — ver Riesgo R-1.
- Regenerar los artefactos de salida (`json-pmo.json`, `advertencias-normalizacion.json`, `reporte-validacion.json`, `reporte-validacion.md`) ejecutando los scripts ya corregidos.
- Verificar (no modificar) que `auditor_funcional.py` siga funcionando correctamente contra el nuevo `reporte-validacion.json`.

### 2.2 Fuera del alcance

- No se construye el Resolutor de Catálogos.
- No se construye el Importador.
- No se toca backend, Prisma, base de datos ni frontend.
- No se modifica el Excel de origen bajo ninguna circunstancia.
- No se reintroduce el bloque `origen` completo.
- No se agregan dimensiones nuevas a la Auditoría Funcional (`auditor_funcional.py`) más allá de lo necesario para que siga leyendo correctamente `reporte-validacion.json`.
- No se resuelven manualmente las inconsistencias de datos detectadas (código duplicado `PRO-PROY-01`, variantes de escritura, mezcla área/cargo, etc.). Este sprint cambia la **estructura**, no corrige el **contenido** del Excel.

---

## 3. Cambios aprobados (detalle de implementación)

### 3.1 Promover `codigoArea` a entidad relacional

**Estado actual:** `codigoArea` está en `CAMPOS_DIRECTOS` (línea ~53 de `normalizador.py`), se copia tal cual, sin `codigoAreaClave` ni `codigoAreaId`, y no alimenta ningún catálogo.

**Cambio requerido:**
- Quitar `"codigoArea"` de la lista `CAMPOS_DIRECTOS`.
- Agregar la tupla `("codigoArea", "codigoArea")` a la lista `CAMPOS_RELACIONALES`.
- En el diccionario que mapea `campo_origen` a categoría de catálogo (dentro del bucle de `CAMPOS_RELACIONALES` en la función `normalizar`), agregar la entrada `"codigoArea": "codigosArea"`.
- Resultado esperado por documento: los campos `codigoArea`, `codigoAreaClave`, `codigoAreaId` deben aparecer con el mismo patrón que `area`/`areaClave`/`areaId`.
- Resultado esperado en catálogos: debe existir una nueva clave `catalogos.codigosArea`, con la misma forma que las demás (`valorOriginal`, `clave`, `conteo`), construida por la función `registrar_catalogo` ya existente (no crear una función nueva).
- **No** se debe intentar vincular `codigoArea` con `area` en este sprint (por ejemplo, no resolver cuál de los dos es la fuente de verdad, no fusionarlos, no crear un campo combinado). Esa conciliación es responsabilidad del futuro Resolutor de Catálogos. Aquí solo se promueve `codigoArea` al mismo estatus relacional que los demás campos.

### 3.2 Conciliar el catálogo de procesos con los documentos tipo PROCESO

**Estado actual:** `catalogos.procesos` se construye únicamente a partir de los valores no nulos del campo `proceso` en cualquier documento. Los documentos con `tipoDocumental == "PROCESO"` no se cruzan con este catálogo; su `nombre` (que representa la definición formal del proceso) se ignora para este propósito.

**Cambio requerido — dos partes:**

**Parte A — Marca por documento.**
Agregar un nuevo campo booleano `esDefinicionDeProceso` a cada documento normalizado (a nivel raíz del documento, junto a `codigoDocumento`, no dentro de `metadata`). Su valor es `true` si `tipoDocumental == "PROCESO"`, `false` en cualquier otro caso. Este campo se agrega siempre, para los 300 documentos, sin excepción.

**Parte B — Enriquecimiento del catálogo `procesos`.**
Después de construir `catalogos["procesos"]` de la forma actual (a partir del campo `proceso` referenciado), se debe:

1. Calcular el conjunto de **procesos definidos**: para cada documento con `tipoDocumental == "PROCESO"` y `nombre` no nulo, se toma `nombre` como el proceso definido, y se calcula su `clave` con la misma función `slugify` ya existente.
2. Para cada entrada ya existente en `catalogos["procesos"]` (procesos referenciados), agregar dos campos nuevos:
   - `definidoComoDocumento` (booleano): `true` si la `clave` de esa entrada coincide con la `clave` de algún proceso definido (paso 1), `false` en caso contrario.
   - `codigoDocumentoDefinicion` (string o `null`): si `definidoComoDocumento` es `true`, el `codigoDocumento` del documento tipo PROCESO correspondiente (si hay más de un documento tipo PROCESO con la misma clave, tomar el primero en el orden en que aparecen en `documentos_excel`, y registrar una advertencia — ver más abajo). Si `definidoComoDocumento` es `false`, este campo es `null`.
3. Para cada proceso definido (paso 1) cuya `clave` **no** exista todavía en `catalogos["procesos"]` (es decir, un proceso definido formalmente que ningún otro documento referenció jamás), se debe **agregar una nueva entrada** al catálogo con:
   - `valorOriginal`: el `nombre` del documento tipo PROCESO.
   - `clave`: su slug.
   - `conteo`: `0` (porque nadie lo referenció; el conteo mide referencias, no la existencia del proceso en sí).
   - `definidoComoDocumento`: `true`.
   - `codigoDocumentoDefinicion`: el `codigoDocumento` de ese documento tipo PROCESO.
4. El orden final de `catalogos["procesos"]` se mantiene igual que hoy: ordenado por `conteo` descendente (los procesos con `conteo: 0` agregados en el paso 3 quedarán al final, lo cual es el comportamiento correcto y esperado).

**Nueva advertencia asociada (agregar a la lista de advertencias, nivel `"catalogo"`):**
Por cada proceso definido (paso 1) cuya `clave` no tenga ninguna referencia (`conteo == 0` en el catálogo final), agregar una advertencia:
```
nivel: "catalogo"
campo: "proceso"
tipo: "Proceso definido sin documentos que lo referencien"
detalle: "'<nombre del proceso>' (documento <codigoDocumento>) no es referenciado como 'proceso' por ningún otro documento"
```

**Importante:** esta reconciliación es de **solo lectura y anotación**. No se debe modificar el campo `proceso` de ningún documento, no se debe inventar un valor de `proceso` para los documentos tipo PROCESO, y no se debe intentar "completar" el campo `proceso` de otros documentos basándose en esta reconciliación.

### 3.3 Separar el catálogo de responsables por rol

**Estado actual:** el diccionario de mapeo `categoria_catalogo` (dentro de la función `normalizar`) mapea tanto `"responsableActualizacion"` como `"responsableRevision"` a la misma categoría `"responsables"`, mezclando ambos roles en un solo catálogo.

**Cambio requerido:**
- Cambiar el mapeo para que `"responsableActualizacion"` produzca la categoría `"responsablesActualizacion"` y `"responsableRevision"` produzca la categoría `"responsablesRevision"`.
- Resultado esperado: `catalogos.responsables` desaparece por completo. En su lugar existen `catalogos.responsablesActualizacion` y `catalogos.responsablesRevision`, cada uno con la misma forma de entrada (`valorOriginal`, `clave`, `conteo`) que hoy tiene `responsables`, pero contando únicamente las apariciones de ese rol específico.
- Los campos por documento (`responsableActualizacion`, `responsableActualizacionClave`, `responsableActualizacionId`, `responsableRevision`, `responsableRevisionClave`, `responsableRevisionId`) **no cambian**. El cambio es exclusivamente en la estructura de `catalogos`.
- No se debe crear un catálogo combinado adicional "por si acaso". Solo deben existir los dos catálogos separados.

### 3.4 Eliminar redundancias de metadata

**Estado actual:**
- Metadata por documento (`registro["metadata"]`): `origenHoja`, `filaExcel` (siempre `null`), `fechaTransformacion` (idéntico en los 300 documentos), `versionPipeline` (idéntico en los 300 documentos).
- Metadata raíz (`salida_pmo["metadata"]`): `fechaGeneracion`, `versionPipeline`, `archivoOrigen`, `totalDocumentos`.

**Cambio requerido:**

**Metadata por documento** — se reduce a únicamente:
```
"metadata": {
  "origenHoja": <string>,
  "filaExcel": <null>
}
```
Se eliminan de aquí `fechaTransformacion` y `versionPipeline`. Esta metadata por documento contiene solo información que **varía por documento** (o que en el futuro podría variar, como `filaExcel`). `origenHoja` se mantiene aquí porque es un dato propio de cada documento (distintos documentos tienen distinta hoja de origen).

**Metadata raíz** — se amplía a:
```
"metadata": {
  "fechaGeneracion": <string ISO 8601>,
  "fechaTransformacion": <string ISO 8601>,
  "versionNormalizador": <string>,
  "versionTransformador": <string>,
  "archivoOrigen": <string>,
  "totalDocumentos": <integer>
}
```
- `fechaGeneracion`: se mantiene igual (momento en que corrió el Normalizador).
- `fechaTransformacion`: se mueve aquí desde el nivel de documento. Se sigue calculando exactamente igual que hoy (aproximación basada en `os.path.getmtime` del archivo de entrada). No cambiar esa lógica de cálculo, solo su ubicación en el JSON de salida.
- `versionNormalizador`: renombrar la constante actual `VERSION_PIPELINE` a `VERSION_NORMALIZADOR` en `normalizador.py`, manteniendo el mismo valor de cadena (`"normalizador-1.0.0"`). Este es el único uso de esa constante en el JSON de salida raíz.
- `versionTransformador`: ver sección 3.5.
- `archivoOrigen` y `totalDocumentos`: sin cambios.

**Regla de validación de esta sección:** después del cambio, ningún valor de `fechaTransformacion` ni de versión debe aparecer repetido 300 veces dentro de `documentos[]`. Debe aparecer exactamente una vez, en `metadata` (raíz).

### 3.5 Agregar versionado del Transformador

**Restricción a respetar:** el Transformador no debe modificar su contrato de salida. `documentos-biblioteca.json` sigue siendo un arreglo plano de documentos (`[ {...}, {...}, ... ]`), exactamente como hoy. No se agrega ninguna envoltura de metadata a la salida del Transformador. Esta restricción es más importante que la conveniencia de leer la versión dinámicamente.

**Cambio requerido en `transformador.py` (el único cambio permitido en este archivo):**
- Agregar una constante `VERSION_TRANSFORMADOR = "transformador-1.0.0"` cerca de las demás constantes de configuración (junto a `DEFAULT_INPUT`, `DEFAULT_OUTPUT_DIR`, etc.).
- Esta constante no se usa en ninguna lógica de transformación. No se imprime como parte del JSON de salida. Su único propósito es dejar registrada la versión del script en el código fuente, de forma legible por humanos y por el propio Normalizador (ver abajo).
- No modificar ninguna otra línea de `transformador.py`. No modificar `main()`, no modificar las funciones de transformación, no modificar los mensajes de consola.

**Cambio requerido en `normalizador.py`:**
- Agregar una constante `VERSION_TRANSFORMADOR_COMPATIBLE = "transformador-1.0.0"` junto a `VERSION_NORMALIZADOR`. Esta constante debe mantenerse manualmente sincronizada con la constante `VERSION_TRANSFORMADOR` de `transformador.py` — no se lee dinámicamente ni se importa el módulo del Transformador (el Normalizador no debe importar `transformador.py`; deben seguir siendo scripts independientes, ejecutables por separado).
- Esta constante se escribe en la metadata raíz de `json-pmo.json` como `versionTransformador` (ver sección 3.4).
- Agregar un comentario explícito en el código, justo encima de esta constante, indicando: *"Esta constante debe actualizarse manualmente cada vez que cambie VERSION_TRANSFORMADOR en transformador.py. No se sincroniza automáticamente."*

### 3.6 Mantener la estructura valor / valorClave / valorId

No requiere cambios de código. Se incluye aquí como criterio de aceptación explícito: todos los campos relacionales existentes (`tipoDocumental`, `area`, `proceso`, `responsableActualizacion`, `responsableRevision`) y el nuevo (`codigoArea`) deben seguir exactamente el mismo patrón de tres campos hermanos. No se debe anidar ningún objeto `{valor, clave, id}` en ningún punto de este sprint.

---

## 4. Cambios descartados (explícitamente fuera de este sprint)

- **Reintroducir el bloque `origen` completo dentro de cada documento.** Descartado por decisión del Product Owner. La trazabilidad se garantiza con los artefactos existentes del pipeline (`documentos-biblioteca.json` como fuente intermedia, `errores-importacion.json`, `advertencias-normalizacion.json`), no duplicando el registro original dentro de cada documento normalizado.
- **Resolver la relación real entre `codigoArea` y `area`** (decidir cuál es la fuente de verdad, fusionarlos, o resolver los 7 casos de inconsistencia detectados en la auditoría). Ambos quedan como entidades relacionales independientes y sin vincular; su conciliación es tarea del futuro Resolutor de Catálogos.
- **Corregir el código duplicado `PRO-PROY-01`** ni ninguna otra inconsistencia de contenido del Excel.
- **Agregar `filaExcel` real.** Sigue en `null`; no se modifica `transformador.py` para emitir número de fila (eso excede el cambio mínimo autorizado en la sección 3.5).
- **Registrar el nombre del archivo Excel original dentro del JSON.** No fue parte de los cambios aprobados en este sprint.
- **Cualquier cambio a `auditor_funcional.py`** más allá de la verificación de que sigue funcionando (sección 7, Paso 7). Si algo llegara a romperse ahí, se reporta como hallazgo, no se corrige en este sprint sin aprobación explícita.

---

## 5. Archivos que deberán modificarse

| Archivo | Tipo de cambio | Alcance del cambio |
|---|---|---|
| `normalizador.py` | Modificación funcional | Cambios 3.1, 3.2, 3.3, 3.4, 3.5 (constante `VERSION_TRANSFORMADOR_COMPATIBLE`) |
| `transformador.py` | Modificación mínima aditiva | Únicamente agregar la constante `VERSION_TRANSFORMADOR` (sección 3.5). Ninguna otra línea. |
| `validador.py` | Modificación de compatibilidad (obligatoria, no opcional) | Ajustar las funciones que leen `catalogos.get("responsables", ...)` y el mapeo de categorías en `validar_catalogos`, para reflejar la nueva estructura de catálogos (`responsablesActualizacion`, `responsablesRevision`, `codigosArea`). Ver detalle en sección 7, Paso 6. |

## 6. Archivos que NO deben modificarse

- `Listado_Maestro_2026__3_.xlsx` (el Excel original). Bajo ninguna circunstancia.
- `auditor_funcional.py`. No requiere cambios de código (ver verificación en sección 7, Paso 7). Si la verificación revela un problema, se detiene el sprint y se reporta — no se modifica este archivo sin una decisión explícita nueva.
- Cualquier archivo de salida generado (`documentos-biblioteca.json`, `errores-importacion.json`, `json-pmo.json`, `advertencias-normalizacion.json`, `reporte-validacion.json`, `reporte-validacion.md`, `auditoria-funcional.json`, `auditoria-funcional.md`) no se edita a mano. Estos archivos solo se regeneran ejecutando los scripts correspondientes.
- No se crea ningún archivo nuevo de backend, frontend, Prisma, base de datos, ni ningún importador.

---

## 7. Orden exacto de implementación

Los pasos deben ejecutarse en este orden. No adelantar pasos ni combinarlos.

**Paso 1 — Preparación.**
1.1. Confirmar que existen y son legibles: `transformador.py`, `normalizador.py`, `validador.py`, `documentos-biblioteca.json`, `Listado_Maestro_2026__3_.xlsx`.
1.2. Guardar una copia de respaldo de `normalizador.py`, `transformador.py` y `validador.py` antes de tocarlos (por ejemplo, con sufijo `.bak` en un directorio temporal de trabajo, no en la carpeta de salidas oficiales).
1.3. Calcular y anotar el checksum (`md5sum`) de `documentos-biblioteca.json` actual. Este archivo no debe cambiar como resultado de este sprint; el checksum al final debe ser idéntico.

**Paso 2 — Modificar `transformador.py`.**
2.1. Agregar únicamente la constante `VERSION_TRANSFORMADOR = "transformador-1.0.0"` (sección 3.5).
2.2. Ejecutar `transformador.py` sobre el Excel y confirmar que `documentos-biblioteca.json` resultante es **byte a byte idéntico** al que existía antes del cambio (comparar checksums del Paso 1.3). Si difiere en cualquier byte, detener el sprint: significa que el cambio tuvo un efecto no deseado.

**Paso 3 — Modificar `normalizador.py`: campos relacionales y catálogos.**
3.1. Implementar el cambio 3.1 (`codigoArea` relacional).
3.2. Implementar el cambio 3.3 (split de responsables por rol).
3.3. Implementar el cambio 3.2 (reconciliación de procesos), incluida la nueva advertencia de nivel `"catalogo"`.
3.4. Agregar el campo `esDefinicionDeProceso` a nivel de documento (parte A del cambio 3.2).

**Paso 4 — Modificar `normalizador.py`: metadata.**
4.1. Implementar el cambio 3.4 (metadata por documento reducida a `origenHoja` + `filaExcel`; metadata raíz ampliada).
4.2. Renombrar `VERSION_PIPELINE` a `VERSION_NORMALIZADOR`.
4.3. Agregar la constante `VERSION_TRANSFORMADOR_COMPATIBLE` con su comentario de sincronización manual (cambio 3.5).

**Paso 5 — Ejecutar el Normalizador y verificar salida.**
5.1. Ejecutar `normalizador.py` usando como entrada el `documentos-biblioteca.json` verificado en el Paso 2.2.
5.2. Inspeccionar manualmente (o con un script de verificación puntual, sin modificar el pipeline) que:
   - Cada uno de los 300 documentos tiene `codigoArea`, `codigoAreaClave`, `codigoAreaId`.
   - Cada documento tiene `esDefinicionDeProceso` (booleano).
   - Cada documento tiene `metadata` con exactamente dos claves: `origenHoja`, `filaExcel`.
   - `catalogos` tiene las claves: `tiposDocumentales`, `areas`, `codigosArea`, `procesos`, `responsablesActualizacion`, `responsablesRevision`, `estados`. La clave `responsables` no debe existir.
   - Cada entrada de `catalogos.procesos` tiene `definidoComoDocumento` y `codigoDocumentoDefinicion`.
   - `salida_pmo["metadata"]` (raíz) tiene: `fechaGeneracion`, `fechaTransformacion`, `versionNormalizador`, `versionTransformador`, `archivoOrigen`, `totalDocumentos`.

**Paso 6 — Ajustar `validador.py` para el nuevo esquema de catálogos.**
6.1. En la función `validar_responsables(documentos, catalogo_responsables)`: cambiar su firma para recibir ambos catálogos, por ejemplo `validar_responsables(documentos, catalogo_responsables_actualizacion, catalogo_responsables_revision)`. Dentro de la función, calcular `responsablesDistintos` como el número de `clave` distintas presentes en la **unión** de ambos catálogos (una persona que aparece en ambos roles cuenta una sola vez). Actualizar el punto donde se llama a esta función (dentro de `main()`) para pasar `catalogos.get("responsablesActualizacion", [])` y `catalogos.get("responsablesRevision", [])` en vez de `catalogos.get("responsables", [])`.
6.2. En la función `validar_catalogos(catalogos, documentos)`: actualizar el diccionario `mapa_campo` agregando `"responsablesActualizacion": "responsableActualizacion"`, `"responsablesRevision": "responsableRevision"` y `"codigosArea": "codigoArea"`. Eliminar la rama `elif categoria == "responsables":` (ya no aplica, porque ahora `responsablesActualizacion` y `responsablesRevision` se resuelven igual que cualquier otro campo relacional a través de `mapa_campo`, sin necesitar tratamiento especial).
6.3. No modificar ninguna otra función de `validador.py`. En particular, no modificar `validar_areas`, `validar_procesos`, `validar_estados`, `validar_tipos_documentales`, ni la generación del Markdown (`generar_markdown`), salvo que al ejecutar el Paso 6.4 se detecte un error concreto que lo requiera (en cuyo caso, detener y reportar antes de decidir el cambio).
6.4. Ejecutar `validador.py` contra el nuevo `json-pmo.json` y confirmar que corre sin excepciones y que `reporte-validacion.json` / `reporte-validacion.md` se generan correctamente, con la sección "Responsables" mostrando un número de "Responsables distintos" mayor o igual al mayor de los dos catálogos individuales (nunca menor).

**Paso 7 — Verificar (sin modificar) `auditor_funcional.py`.**
7.1. Ejecutar `auditor_funcional.py` usando el nuevo `json-pmo.json` y el nuevo `reporte-validacion.json` como entrada.
7.2. Confirmar que corre sin excepciones y que genera `auditoria-funcional.json` y `auditoria-funcional.md`.
7.3. Si se produce cualquier error o valor claramente incorrecto (por ejemplo, "Responsables distintos: 0" cuando antes había 67), detener el sprint y reportarlo como hallazgo pendiente de decisión — no corregir `auditor_funcional.py` sin aprobación.

**Paso 8 — Regenerar todos los artefactos finales.**
8.1. Confirmar que los cuatro artefactos de salida del sprint quedaron regenerados: `json-pmo.json`, `advertencias-normalizacion.json`, `reporte-validacion.json`, `reporte-validacion.md`, `auditoria-funcional.json`, `auditoria-funcional.md`.
8.2. Confirmar nuevamente que `documentos-biblioteca.json` y `errores-importacion.json` (salidas del Transformador) son idénticos a los del inicio del sprint.
8.3. Confirmar que el Excel original no fue modificado (comparar checksum contra el registrado antes de iniciar cualquier sprint de esta serie).

---

## 8. Riesgos

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R-1 | Cambiar el esquema de `catalogos` en el Normalizador sin ajustar `validador.py` provoca que el Validador reporte "0 responsables distintos" o listas vacías de variantes ortográficas **sin lanzar ningún error** (falla silenciosa). | Alta si no se sigue el Paso 6 | Alto — un reporte técnico incorrecto puede pasar desapercibido y viajar hasta decisiones de negocio. | Paso 6 obligatorio, con verificación explícita del número de responsables distintos antes/después. |
| R-2 | `VERSION_TRANSFORMADOR_COMPATIBLE` en `normalizador.py` queda desincronizada de `VERSION_TRANSFORMADOR` en `transformador.py` si en el futuro se actualiza uno sin el otro. | Media (es un valor manual) | Bajo en este sprint, medio a futuro. | Comentario explícito en el código (sección 3.5). Se recomienda, en un sprint futuro, agregar un caso de prueba automatizado que falle si ambas constantes divergen (no implementar ahora, solo dejar registrado). |
| R-3 | Al reconciliar procesos (3.2), que exista más de un documento tipo PROCESO con el mismo `nombre`/clave, generando ambigüedad sobre qué `codigoDocumento` usar en `codigoDocumentoDefinicion`. | Baja (no se observó en los datos actuales, pero no está garantizado) | Medio | Regla explícita ya definida en 3.2 (tomar el primero en orden de aparición) más una advertencia registrada — ver Caso borde CB-3. |
| R-4 | El cambio en `transformador.py` (aunque es solo agregar una constante) se hace mal y termina afectando accidentalmente el archivo de salida. | Baja | Alto (rompería la regla de "no modificar el transformador") | Verificación de checksum obligatoria en el Paso 2.2 antes de continuar. |
| R-5 | Al mover `fechaTransformacion` fuera del documento, algún consumidor futuro (por ejemplo, un reporte que todavía no existe) que esperaba encontrarla en `documento.metadata.fechaTransformacion` deje de funcionar. | Baja en este sprint (no hay consumidores además de `validador.py` y `auditor_funcional.py`, ya verificados) | Bajo | Verificación explícita en Pasos 6 y 7 de que ningún script existente depende de esa ruta. |
| R-6 | Confundir `codigoArea` (nuevo campo relacional) con `area` al momento de calcular claves, generando que ambos usen la misma clave por error de copiar/pegar en el código. | Media (son campos muy parecidos en el código) | Medio (produciría un catálogo `codigosArea` incorrecto) | Verificación puntual en el Paso 5.2 revisando manualmente 2-3 documentos de ejemplo y comparando `codigoArea`/`codigoAreaClave` contra `area`/`areaClave` para confirmar que son independientes. |

---

## 9. Casos borde

- **CB-1 — Documento con `proceso` nulo y `tipoDocumental == "PROCESO"`.** Existen documentos tipo PROCESO cuyo campo `proceso` (no `nombre`) puede venir vacío (es normal: un documento que define un proceso no necesariamente referencia otro proceso). Esto no debe generar ninguna advertencia nueva relacionada con 3.2; la advertencia existente "Proceso sin informacion" (ya implementada) puede seguir disparándose para ese campo de forma independiente, sin relación con la reconciliación.
- **CB-2 — Documento tipo PROCESO con `nombre` nulo.** Si existiera un documento con `tipoDocumental == "PROCESO"` pero `nombre` nulo, no debe incluirse en el conjunto de "procesos definidos" (Parte B, paso 1 de la sección 3.2), porque no hay texto del cual derivar una clave. Debe seguir generando la advertencia ya existente "Nombre de documento vacio" (sin cambios).
- **CB-3 — Dos documentos tipo PROCESO con el mismo nombre (misma clave).** Aplicar la regla de la sección 3.2 (tomar el primero en orden de aparición) y adicionalmente registrar una advertencia nueva, nivel `"catalogo"`, tipo `"Proceso definido mas de una vez"`, con el detalle de los `codigoDocumento` involucrados.
- **CB-4 — `codigoArea` vacío/nulo.** Igual que los demás campos relacionales: `codigoArea` queda `null`, `codigoAreaClave` queda `null` (la función `slugify` ya maneja `None` devolviendo `None`), `codigoAreaId` queda `null`, y no se registra entrada en `catalogos.codigosArea` para ese documento (la función `registrar_catalogo` ya ignora valores `None`). No se debe crear ninguna advertencia nueva para `codigoArea` vacío en este sprint (no fue aprobado).
- **CB-5 — Un responsable que aparece como `responsableActualizacion` en un documento y como `responsableRevision` en otro.** Debe aparecer en ambos catálogos (`responsablesActualizacion` y `responsablesRevision`) de forma independiente, cada uno con su propio conteo. No se debe deduplicar entre catálogos: son catálogos distintos por diseño (cambio 3.3).
- **CB-6 — Catálogo `procesos` termina con entradas de `conteo: 0`.** Es el comportamiento esperado para procesos definidos pero nunca referenciados (paso 3 de la sección 3.2). No se debe filtrar ni ocultar estas entradas del catálogo final.
- **CB-7 — Ejecutar `normalizador.py` sin haber corrido primero el Paso 2 (constante nueva en `transformador.py`).** El Normalizador no debe fallar si `documentos-biblioteca.json` no contiene ninguna referencia a la versión del Transformador (de hecho nunca la contendrá, porque el contrato de salida del Transformador no cambia). La constante `VERSION_TRANSFORMADOR_COMPATIBLE` vive únicamente en el código de `normalizador.py`, no depende de leer nada del archivo de entrada.

---

## 10. Casos de prueba

Todos los casos de prueba se ejecutan sobre los datos reales ya existentes (`Listado_Maestro_2026__3_.xlsx` → pipeline completo), no se requieren datos sintéticos adicionales salvo que se indique lo contrario.

| ID | Caso | Pasos | Resultado esperado |
|---|---|---|---|
| CP-1 | Integridad del Transformador tras el cambio 3.5 | Ejecutar `transformador.py` antes y después de agregar `VERSION_TRANSFORMADOR`; comparar checksums de `documentos-biblioteca.json` | Checksums idénticos |
| CP-2 | `codigoArea` relacional presente en todos los documentos | Cargar `json-pmo.json`; iterar los 300 documentos | Los 300 tienen las claves `codigoArea`, `codigoAreaClave`, `codigoAreaId` |
| CP-3 | Independencia de clave entre `area` y `codigoArea` | Tomar el documento `MAN-GG-01-0` (o equivalente, el primero de la hoja "1 Manuales...") | `area == "Gerencia"`, `areaClave == "gerencia"`, `codigoArea == "0"`, `codigoAreaClave == "0"` (distintos entre sí, cada uno slug de su propio valor) |
| CP-4 | Catálogo `codigosArea` existe y no está vacío | Cargar `json-pmo.json` → `catalogos.codigosArea` | Lista no vacía; cada entrada tiene `valorOriginal`, `clave`, `conteo` |
| CP-5 | El catálogo `responsables` (combinado) ya no existe | Cargar `json-pmo.json` → `catalogos` | La clave `"responsables"` no está presente; sí están `"responsablesActualizacion"` y `"responsablesRevision"` |
| CP-6 | Separación correcta por rol | Elegir una persona conocida que aparezca en ambos roles en distintos documentos (verificar previamente cuál) | Aparece con conteos independientes en `responsablesActualizacion` y en `responsablesRevision`; la suma de ambos conteos para esa persona es igual al total de documentos donde aparece en cualquiera de los dos roles |
| CP-7 | `esDefinicionDeProceso` correcto | Filtrar documentos con `tipoDocumental == "PROCESO"` | Los 6 documentos de la hoja "2 Procesos" tienen `esDefinicionDeProceso == true`; los 294 restantes tienen `false` |
| CP-8 | Reconciliación de procesos — caso con referencia | Tomar un proceso definido que sí sea referenciado por otros documentos (por ejemplo "Operaciones", si corresponde) | La entrada en `catalogos.procesos` tiene `definidoComoDocumento == true` y `codigoDocumentoDefinicion` con el código correcto del documento tipo PROCESO |
| CP-9 | Reconciliación de procesos — caso sin referencia | Identificar al menos un proceso definido que ningún documento referencia (según el hallazgo ya reportado en la Auditoría Funcional anterior) | Existe una entrada nueva en `catalogos.procesos` con `conteo == 0`, `definidoComoDocumento == true`, y se generó la advertencia "Proceso definido sin documentos que lo referencien" |
| CP-10 | Metadata por documento reducida | Cargar cualquier documento de `json-pmo.json` → `metadata` | Contiene exactamente dos claves: `origenHoja`, `filaExcel`. No contiene `fechaTransformacion` ni `versionPipeline`/`versionNormalizador` |
| CP-11 | Metadata raíz completa | Cargar `json-pmo.json` → `metadata` (raíz) | Contiene: `fechaGeneracion`, `fechaTransformacion`, `versionNormalizador`, `versionTransformador`, `archivoOrigen`, `totalDocumentos` |
| CP-12 | No hay redundancia de fecha/versión | Cargar `json-pmo.json` → recorrer `documentos[]` | Ningún documento tiene `fechaTransformacion` ni `versionPipeline`/`versionNormalizador` a nivel de documento |
| CP-13 | `validador.py` corre sin excepciones sobre el nuevo esquema | Ejecutar `python3 validador.py` con el nuevo `json-pmo.json` | Código de salida 0; se generan `reporte-validacion.json` y `.md` |
| CP-14 | `validador.py` reporta responsables correctamente | Comparar `reporte-validacion.json → responsables → responsablesDistintos` antes y después del cambio | El número no debe caer a 0 ni ser menor al mayor de los dos catálogos separados |
| CP-15 | `auditor_funcional.py` sigue funcionando sin modificarse | Ejecutar `python3 auditor_funcional.py` con los nuevos `json-pmo.json` y `reporte-validacion.json` | Código de salida 0; `auditoria-funcional.json`/`.md` se generan; los números de responsables y hallazgos son coherentes con los de CP-14 |
| CP-16 | El Excel original no fue tocado | Checksum de `Listado_Maestro_2026__3_.xlsx` antes y después de todo el sprint | Idéntico |
| CP-17 | No existe ningún bloque `origen` con el registro completo | Cargar cualquier documento de `json-pmo.json` | No existe ninguna clave `origen`, ni ningún campo que contenga el diccionario completo del Transformador anidado |
| CP-18 | Patrón `valor/valorClave/valorId` intacto para campos preexistentes | Cargar un documento y revisar `tipoDocumental`, `area`, `proceso`, `responsableActualizacion`, `responsableRevision` | Cada uno mantiene sus tres campos hermanos sin anidamiento, sin cambios de nombre |

---

## 11. Criterios de aceptación

El sprint se considera terminado únicamente si se cumplen **todos** los siguientes puntos:

1. Todos los casos de prueba de la sección 10 (CP-1 a CP-18) pasan.
2. `documentos-biblioteca.json` y `errores-importacion.json` son idénticos byte a byte a los existentes antes del sprint.
3. El Excel original no fue modificado (checksum idéntico).
4. `normalizador.py` no importa ni ejecuta código de `transformador.py` (siguen siendo scripts independientes).
5. `validador.py` sigue aceptando los mismos argumentos de línea de comandos que antes (`ruta_json_pmo`, `carpeta_salida`), sin cambios de interfaz.
6. `auditor_funcional.py` no fue modificado (cero diffs contra la versión previa al sprint).
7. No existe en ningún archivo de salida un bloque `origen` con el registro completo del documento.
8. La documentación embebida (docstring superior) de `normalizador.py` se actualiza para reflejar los cambios de este sprint (nueva versión, nueva estructura de catálogos, nueva metadata). No es necesario un CHANGELOG separado, pero el docstring debe dejar de describir el esquema viejo.
9. Los seis cambios aprobados (sección 3, puntos 3.1 a 3.6) están implementados exactamente como se describen, sin variaciones de naming ni de estructura no autorizadas en este documento.
10. Ninguno de los cambios descartados (sección 4) fue implementado.

---

## 12. Checklist final

- [ ] Backups de `normalizador.py`, `transformador.py`, `validador.py` tomados antes de empezar.
- [ ] Checksum inicial de `documentos-biblioteca.json` registrado.
- [ ] Checksum inicial de `Listado_Maestro_2026__3_.xlsx` registrado.
- [ ] `VERSION_TRANSFORMADOR` agregada a `transformador.py` (única línea nueva).
- [ ] `transformador.py` ejecutado; checksum de `documentos-biblioteca.json` verificado idéntico.
- [ ] `codigoArea` movido de `CAMPOS_DIRECTOS` a `CAMPOS_RELACIONALES` en `normalizador.py`.
- [ ] Mapeo `codigoArea → "codigosArea"` agregado.
- [ ] Mapeo de responsables separado en `"responsablesActualizacion"` / `"responsablesRevision"`.
- [ ] Campo `esDefinicionDeProceso` agregado a cada documento.
- [ ] Reconciliación de procesos implementada (parte B completa: enriquecimiento + entradas nuevas con `conteo: 0`).
- [ ] Nueva advertencia "Proceso definido sin documentos que lo referencien" implementada.
- [ ] Metadata por documento reducida a `origenHoja` + `filaExcel`.
- [ ] Metadata raíz ampliada con `fechaTransformacion`, `versionNormalizador`, `versionTransformador`.
- [ ] `VERSION_PIPELINE` renombrada a `VERSION_NORMALIZADOR`.
- [ ] `VERSION_TRANSFORMADOR_COMPATIBLE` agregada con comentario de sincronización manual.
- [ ] `normalizador.py` ejecutado exitosamente; `json-pmo.json` y `advertencias-normalizacion.json` regenerados.
- [ ] Verificación manual de 2-3 documentos de ejemplo (estructura completa, `codigoArea` independiente de `area`).
- [ ] `validador.py` ajustado: `validar_responsables` acepta dos catálogos; `mapa_campo` actualizado; rama especial de `"responsables"` eliminada.
- [ ] `validador.py` ejecutado exitosamente sobre el nuevo `json-pmo.json`.
- [ ] `auditor_funcional.py` ejecutado sin modificaciones sobre los nuevos artefactos; sin errores.
- [ ] Los 18 casos de prueba (CP-1 a CP-18) ejecutados y documentados como pasa/falla.
- [ ] Los 10 criterios de aceptación revisados uno por uno.
- [ ] Docstring de `normalizador.py` actualizado.
- [ ] Confirmación final de que `Listado_Maestro_2026__3_.xlsx`, `documentos-biblioteca.json` y `errores-importacion.json` no cambiaron respecto al inicio del sprint.
- [ ] Confirmación final de que no se creó ningún bloque `origen`, backend, Prisma, ni código de frontend.

---

*Fin de la especificación. Cualquier situación no contemplada explícitamente en este documento debe pausar la implementación y escalarse para decisión, no resolverse por inferencia.*
