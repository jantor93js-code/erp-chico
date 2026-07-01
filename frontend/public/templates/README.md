Plantilla de importación - PMO Biblioteca Documental

Archivos incluidos:
- `pmo_biblioteca_template.csv` : Plantilla CSV con cabeceras y dos filas de ejemplo.
- `pmo_biblioteca_template.json`: Ejemplo en formato JSON (array de objetos).

Cabeceras (explicación):
- `codigo_manual` : Código interno/manual del documento (ej: DOC-2026-001).
- `codigo_dependencia` : Código de dependencia/ubicación jerárquica (ej: 1.5).
- `nombre_documento` : Nombre visible del documento.
- `tipo_documento` : Tipo (Manual, Política, Procedimiento, etc.).
- `proceso_asociado` : Proceso al que está asociado el documento.
- `area_dependencia` : Área o dependencia responsable.
- `estado_documento` : Estado documental (VIGENTE, NO_VIGENTE, EN_REVISION, PUBLICADO, etc.).
- `responsable` : Nombre del responsable (se asigna a actualización y revisión si aplica).
- `fecha_creacion` : Fecha de creación (YYYY-MM-DD).
- `fecha_ultima_revision` : Fecha de última revisión o próxima revisión (YYYY-MM-DD).
- `observaciones` : Observaciones o comentarios.
- `enlace_drive` : URL válida a documento en Drive o repositorio.

Notas importantes:
- Conserva las cabeceras exactamente como aparecen arriba.
- Si una fila no tiene `codigo_manual` pero sí `codigo_dependencia`, el sistema intentará asumir el código manual a partir del código de dependencia (si corresponde).
- Las fechas deben estar en formato ISO `YYYY-MM-DD` para ser parseadas correctamente.
- `enlace_drive` puede quedar vacío si no hay enlace.

Si quieres, puedo generar una versión `.xlsx` con formato y validación de datos (listas desplegables) para facilitar la carga. ¿La preparo también?