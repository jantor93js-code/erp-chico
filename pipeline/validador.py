#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VALIDADOR PMO
Analiza json-pmo.json (salida del NORMALIZADOR) y determina si la
informacion esta lista para importarse a la Biblioteca Documental.

- Solo LEE json-pmo.json. No modifica datos, no corrige nada, no genera
  ningun JSON normalizado nuevo.
- No importa nada.
- Produce:
    1) reporte-validacion.json  (maquina)
    2) reporte-validacion.md    (informe legible, estilo consultora)
    3) resumen impreso por consola

Uso:
    python3 validador.py [ruta_json_pmo] [carpeta_salida]
"""

import sys
import os
import json
import re
import unicodedata
import datetime
from collections import Counter, defaultdict

# =====================================================================
# CONFIGURACION
# =====================================================================

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

DEFAULT_INPUT = BASE_DIR / "json-pmo.json"
DEFAULT_OUTPUT_DIR = BASE_DIR
VERSION_VALIDADOR = "validador-1.0.0"

TIPOS_DOCUMENTALES_CONOCIDOS = {
    "MANUAL", "PROCESO", "PROCEDIMIENTO", "INSTRUCTIVO", "FORMATO", "POLITICA",
}

# Campos que se evaluan para el puntaje de calidad de CADA documento.
# Cada uno vale lo mismo (10 checks -> 10 puntos cada uno = 100).
CHECKS_CALIDAD = [
    "codigoPresente",
    "codigoUnico",
    "nombrePresente",
    "versionPresente",
    "tipoDocumentalValido",
    "areaPresente",
    "procesoPresente",
    "tieneResponsable",
    "tieneFecha",
    "estadoPresente",
]

CLASIFICACIONES = [
    (95, 100, "Excelente"),
    (85, 94.999, "Buena"),
    (70, 84.999, "Aceptable"),
    (0, 69.999, "Requiere revision"),
]


# =====================================================================
# UTILIDADES
# =====================================================================

def slugify(valor):
    if valor is None:
        return None
    texto = str(valor).strip().lower()
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    texto = re.sub(r"[^a-z0-9]+", "-", texto)
    texto = texto.strip("-")
    return texto if texto != "" else None


def clasificar(porcentaje):
    for minimo, maximo, etiqueta in CLASIFICACIONES:
        if minimo <= porcentaje <= maximo:
            return etiqueta
    return "Requiere revision"


def detectar_variantes_por_clave(documentos, campo_valor):
    """
    Para un campo dado (ej. 'area'), agrupa por clave (slug) y detecta si
    esa misma clave esconde mas de un texto original distinto
    (ej. 'DAF' y 'Daf' -> misma clave, dos escrituras). Esto es lo que
    reportamos como 'duplicados por variacion de escritura'.
    Devuelve: dict clave -> set(valores_originales)
    """
    mapa = defaultdict(set)
    for doc in documentos:
        valor = doc.get(campo_valor)
        if valor is None:
            continue
        clave = slugify(valor)
        mapa[clave].add(valor)
    return {k: v for k, v in mapa.items() if len(v) > 1}


# =====================================================================
# VALIDACIONES: DOCUMENTOS
# =====================================================================

def validar_documentos(documentos):
    total = len(documentos)
    conteo_codigos = Counter(d.get("codigoDocumento") for d in documentos if d.get("codigoDocumento"))
    codigos_duplicados = {c: n for c, n in conteo_codigos.items() if n > 1}

    sin_codigo = [d.get("origenHoja") for d in documentos if not d.get("codigoDocumento")]
    sin_nombre = [d.get("codigoDocumento") for d in documentos if not d.get("nombre")]
    sin_version = [d.get("codigoDocumento") for d in documentos if not d.get("version")]
    sin_fechas = [
        d.get("codigoDocumento") for d in documentos
        if not d.get("fechaCreacion") and not d.get("fechaRevision") and not d.get("fechaProximaRevision")
    ]
    sin_tipo = [
        d.get("codigoDocumento") for d in documentos
        if not d.get("tipoDocumental") or d.get("tipoDocumental") == "DESCONOCIDO"
    ]

    return {
        "totalDocumentos": total,
        "documentosSinCodigo": len(sin_codigo),
        "documentosDuplicados": {
            "totalCodigosDuplicados": len(codigos_duplicados),
            "detalle": [{"codigoDocumento": c, "apariciones": n} for c, n in codigos_duplicados.items()],
        },
        "documentosSinNombre": len(sin_nombre),
        "documentosSinVersion": len(sin_version),
        "documentosSinFechas": len(sin_fechas),
        "documentosSinTipoDocumental": len(sin_tipo),
    }, codigos_duplicados


# =====================================================================
# VALIDACIONES: AREAS / PROCESOS / RESPONSABLES / ESTADOS / TIPOS
# =====================================================================

def validar_areas(documentos, catalogo_areas):
    total_ocurrencias = sum(1 for d in documentos if d.get("area"))
    vacias = sum(1 for d in documentos if not d.get("area"))
    variantes = detectar_variantes_por_clave(documentos, "area")
    return {
        "totalOcurrencias": total_ocurrencias,
        "areasDistintas": len(catalogo_areas),
        "areasVacias": vacias,
        "areasDuplicadasPorEscritura": [
            {"clave": k, "variantes": sorted(v)} for k, v in variantes.items()
        ],
    }


def validar_procesos(documentos, catalogo_procesos):
    total_ocurrencias = sum(1 for d in documentos if d.get("proceso"))
    vacios = sum(1 for d in documentos if not d.get("proceso"))
    return {
        "totalOcurrencias": total_ocurrencias,
        "procesosDistintos": len(catalogo_procesos),
        "procesosVacios": vacios,
    }


def validar_responsables(documentos, catalogo_responsables_actualizacion, catalogo_responsables_revision):
    sin_responsable = sum(
        1 for d in documentos
        if not d.get("responsableActualizacion") and not d.get("responsableRevision")
    )
    variantes_act = detectar_variantes_por_clave(documentos, "responsableActualizacion")
    variantes_rev = detectar_variantes_por_clave(documentos, "responsableRevision")
    variantes = {**variantes_act}
    for k, v in variantes_rev.items():
        variantes.setdefault(k, set()).update(v)

    claves_actualizacion = {e.get("clave") for e in catalogo_responsables_actualizacion if e.get("clave")}
    claves_revision = {e.get("clave") for e in catalogo_responsables_revision if e.get("clave")}
    claves_distintas = claves_actualizacion.union(claves_revision)

    return {
        "responsablesDistintos": len(claves_distintas),
        "documentosSinResponsable": sin_responsable,
        "responsablesRepetidosPorEscritura": [
            {"clave": k, "variantes": sorted(v)} for k, v in variantes.items()
        ],
    }


def validar_estados(documentos):
    conteo = Counter(d.get("estadoOriginal") for d in documentos if d.get("estadoOriginal"))
    vacios = sum(1 for d in documentos if not d.get("estadoOriginal"))
    return {
        "estadosEncontrados": sorted(conteo.keys()),
        "cantidadPorEstado": [{"estado": k, "cantidad": v} for k, v in conteo.most_common()],
        "estadosVacios": vacios,
    }


def validar_tipos_documentales(documentos):
    conteo = Counter(d.get("tipoDocumental") for d in documentos)
    desconocidos = sum(
        n for tipo, n in conteo.items()
        if not tipo or tipo not in TIPOS_DOCUMENTALES_CONOCIDOS
    )
    return {
        "cantidadPorTipo": [{"tipo": k or "(vacio)", "cantidad": v} for k, v in conteo.most_common()],
        "tiposDesconocidos": desconocidos,
    }


# =====================================================================
# VALIDACIONES: CATALOGOS
# =====================================================================

def validar_catalogos(catalogos, documentos):
    mapa_campo = {
        "tiposDocumentales": "tipoDocumental",
        "areas": "area",
        "codigosArea": "codigoArea",
        "procesos": "proceso",
        "responsablesActualizacion": "responsableActualizacion",
        "responsablesRevision": "responsableRevision",
        "estados": "estadoOriginal",
        # 'responsables' combina dos campos, se trata aparte abajo for backward compatibility
    }

    resultado = {}
    for categoria, entradas in catalogos.items():
        claves = [e.get("clave") for e in entradas]
        conteo_claves = Counter(claves)
        claves_repetidas = [c for c, n in conteo_claves.items() if n > 1]
        claves_vacias = sum(1 for c in claves if not c)

        variantes_inconsistentes = []
        campo = mapa_campo.get(categoria)
        if campo:
            variantes = detectar_variantes_por_clave(documentos, campo)
            variantes_inconsistentes = [
                {"clave": k, "variantes": sorted(v)} for k, v in variantes.items()
            ]
        elif categoria == "responsables":
            v1 = detectar_variantes_por_clave(documentos, "responsableActualizacion")
            v2 = detectar_variantes_por_clave(documentos, "responsableRevision")
            combinado = {**v1}
            for k, v in v2.items():
                combinado.setdefault(k, set()).update(v)
            variantes_inconsistentes = [
                {"clave": k, "variantes": sorted(v)} for k, v in combinado.items()
            ]

        resultado[categoria] = {
            "totalEntradas": len(entradas),
            "clavesRepetidas": claves_repetidas,
            "clavesVacias": claves_vacias,
            "valoresInconsistentes": variantes_inconsistentes,
        }

    return resultado


# =====================================================================
# CALIDAD GENERAL
# =====================================================================

def calcular_calidad(documentos, codigos_duplicados):
    scores = []
    detalle_por_doc = []

    for doc in documentos:
        checks = {}
        codigo = doc.get("codigoDocumento")

        checks["codigoPresente"] = bool(codigo)
        checks["codigoUnico"] = bool(codigo) and codigos_duplicados.get(codigo, 1) <= 1
        checks["nombrePresente"] = bool(doc.get("nombre"))
        checks["versionPresente"] = bool(doc.get("version"))
        checks["tipoDocumentalValido"] = bool(doc.get("tipoDocumental")) and doc.get("tipoDocumental") in TIPOS_DOCUMENTALES_CONOCIDOS
        checks["areaPresente"] = bool(doc.get("area"))
        checks["procesoPresente"] = bool(doc.get("proceso"))
        checks["tieneResponsable"] = bool(doc.get("responsableActualizacion")) or bool(doc.get("responsableRevision"))
        checks["tieneFecha"] = bool(doc.get("fechaCreacion")) or bool(doc.get("fechaRevision")) or bool(doc.get("fechaProximaRevision"))
        checks["estadoPresente"] = bool(doc.get("estadoOriginal"))

        puntos = sum(1 for c in CHECKS_CALIDAD if checks[c])
        score_doc = round(puntos / len(CHECKS_CALIDAD) * 100, 2)
        scores.append(score_doc)

        detalle_por_doc.append({
            "codigoDocumento": codigo,
            "origenHoja": doc.get("metadata", {}).get("origenHoja"),
            "puntaje": score_doc,
            "checksFallidos": [c for c in CHECKS_CALIDAD if not checks[c]],
        })

    calidad_global = round(sum(scores) / len(scores), 2) if scores else 0.0
    clasificacion = clasificar(calidad_global)

    # Los 10 documentos con menor puntaje: utiles para el reporte ejecutivo
    peores = sorted(detalle_por_doc, key=lambda x: x["puntaje"])[:10]

    return {
        "calidadDocumentalPorcentaje": calidad_global,
        "clasificacion": clasificacion,
        "documentosConMenorPuntaje": peores,
    }, detalle_por_doc


# =====================================================================
# REPORTE MARKDOWN
# =====================================================================

def generar_markdown(reporte, fecha_generacion):
    r = reporte
    doc = r["documentos"]
    are = r["areas"]
    pro = r["procesos"]
    resp = r["responsables"]
    est = r["estados"]
    tip = r["tiposDocumentales"]
    cat = r["catalogos"]
    cal = r["calidad"]

    md = []
    md.append("# Informe de Validacion PMO — Biblioteca Documental")
    md.append("")
    md.append(f"**Fecha de generacion:** {fecha_generacion}  ")
    md.append(f"**Fuente analizada:** `json-pmo.json`  ")
    md.append(f"**Version del validador:** {VERSION_VALIDADOR}")
    md.append("")
    md.append("---")
    md.append("")

    # ---------------- RESUMEN EJECUTIVO ----------------
    md.append("## Resumen ejecutivo")
    md.append("")
    md.append(
        f"Se analizaron **{doc['totalDocumentos']} documentos** provenientes del Listado "
        f"Maestro 2026, ya procesados por el Transformador y el Normalizador. "
        f"El indice de **calidad documental** resultante es de **{cal['calidadDocumentalPorcentaje']}%**, "
        f"clasificado como **{cal['clasificacion']}**."
    )
    md.append("")
    md.append("| Indicador | Valor |")
    md.append("|---|---|")
    md.append(f"| Total de documentos | {doc['totalDocumentos']} |")
    md.append(f"| Documentos sin codigo | {doc['documentosSinCodigo']} |")
    md.append(f"| Codigos duplicados | {doc['documentosDuplicados']['totalCodigosDuplicados']} |")
    md.append(f"| Documentos sin nombre | {doc['documentosSinNombre']} |")
    md.append(f"| Documentos sin version | {doc['documentosSinVersion']} |")
    md.append(f"| Documentos sin fechas | {doc['documentosSinFechas']} |")
    md.append(f"| Documentos sin tipo documental | {doc['documentosSinTipoDocumental']} |")
    md.append(f"| **Calidad documental** | **{cal['calidadDocumentalPorcentaje']}% — {cal['clasificacion']}** |")
    md.append("")

    # ---------------- METODOLOGIA DE CALIDAD ----------------
    md.append("## Metodologia del indice de calidad")
    md.append("")
    md.append(
        "Cada documento se evalua contra 10 criterios binarios (10 puntos cada uno): "
        "codigo presente, codigo unico, nombre presente, version presente, tipo documental "
        "valido, area presente, proceso presente, al menos un responsable, al menos una "
        "fecha, y estado presente. El puntaje de un documento es el porcentaje de criterios "
        "cumplidos; la calidad documental global es el promedio simple de todos los documentos."
    )
    md.append("")
    md.append("| Rango | Clasificacion |")
    md.append("|---|---|")
    md.append("| 95% - 100% | Excelente |")
    md.append("| 85% - 94% | Buena |")
    md.append("| 70% - 84% | Aceptable |")
    md.append("| Menor a 70% | Requiere revision |")
    md.append("")

    # ---------------- HALLAZGOS: DOCUMENTOS ----------------
    md.append("## Hallazgos por dominio")
    md.append("")
    md.append("### Documentos")
    md.append("")
    if doc["documentosDuplicados"]["detalle"]:
        md.append("**Codigos duplicados detectados:**")
        md.append("")
        md.append("| Codigo | Apariciones |")
        md.append("|---|---|")
        for item in doc["documentosDuplicados"]["detalle"]:
            md.append(f"| {item['codigoDocumento']} | {item['apariciones']} |")
        md.append("")
    else:
        md.append("No se detectaron codigos de documento duplicados.")
        md.append("")

    # ---------------- AREAS ----------------
    md.append("### Areas")
    md.append("")
    md.append("| Indicador | Valor |")
    md.append("|---|---|")
    md.append(f"| Total de ocurrencias (documentos con area) | {are['totalOcurrencias']} |")
    md.append(f"| Areas distintas | {are['areasDistintas']} |")
    md.append(f"| Areas vacias | {are['areasVacias']} |")
    md.append(f"| Posibles duplicados por variacion de escritura | {len(are['areasDuplicadasPorEscritura'])} |")
    md.append("")
    if are["areasDuplicadasPorEscritura"]:
        md.append("**Ejemplos de variantes detectadas (misma clave, distinta escritura):**")
        md.append("")
        for item in are["areasDuplicadasPorEscritura"][:10]:
            md.append(f"- `{item['clave']}` → {', '.join(item['variantes'])}")
        md.append("")

    # ---------------- PROCESOS ----------------
    md.append("### Procesos")
    md.append("")
    md.append("| Indicador | Valor |")
    md.append("|---|---|")
    md.append(f"| Total de ocurrencias (documentos con proceso) | {pro['totalOcurrencias']} |")
    md.append(f"| Procesos distintos | {pro['procesosDistintos']} |")
    md.append(f"| Procesos vacios | {pro['procesosVacios']} |")
    md.append("")

    # ---------------- RESPONSABLES ----------------
    md.append("### Responsables")
    md.append("")
    md.append("| Indicador | Valor |")
    md.append("|---|---|")
    md.append(f"| Responsables distintos | {resp['responsablesDistintos']} |")
    md.append(f"| Documentos sin responsable | {resp['documentosSinResponsable']} |")
    md.append(f"| Posibles duplicados por variacion de escritura | {len(resp['responsablesRepetidosPorEscritura'])} |")
    md.append("")
    if resp["responsablesRepetidosPorEscritura"]:
        md.append("**Ejemplos de variantes detectadas:**")
        md.append("")
        for item in resp["responsablesRepetidosPorEscritura"][:10]:
            md.append(f"- `{item['clave']}` → {', '.join(item['variantes'])}")
        md.append("")

    # ---------------- ESTADOS ----------------
    md.append("### Estados")
    md.append("")
    md.append(f"Estados vacios: **{est['estadosVacios']}**")
    md.append("")
    md.append("| Estado | Cantidad |")
    md.append("|---|---|")
    for item in est["cantidadPorEstado"]:
        md.append(f"| {item['estado']} | {item['cantidad']} |")
    md.append("")
    md.append(
        "> Nota: los estados se muestran tal como vienen del Excel. El Validador no los "
        "mapea ni los interpreta; esa es responsabilidad de una etapa futura."
    )
    md.append("")

    # ---------------- TIPOS DOCUMENTALES ----------------
    md.append("### Tipos documentales")
    md.append("")
    md.append(f"Tipos desconocidos: **{tip['tiposDesconocidos']}**")
    md.append("")
    md.append("| Tipo | Cantidad |")
    md.append("|---|---|")
    for item in tip["cantidadPorTipo"]:
        md.append(f"| {item['tipo']} | {item['cantidad']} |")
    md.append("")

    # ---------------- CATALOGOS ----------------
    md.append("### Catalogos")
    md.append("")
    md.append("| Catalogo | Entradas | Claves repetidas | Claves vacias | Variantes inconsistentes |")
    md.append("|---|---|---|---|---|")
    for categoria, info in cat.items():
        md.append(
            f"| {categoria} | {info['totalEntradas']} | {len(info['clavesRepetidas'])} | "
            f"{info['clavesVacias']} | {len(info['valoresInconsistentes'])} |"
        )
    md.append("")

    # ---------------- ADVERTENCIAS ----------------
    md.append("## Advertencias")
    md.append("")
    advertencias = []
    if doc["documentosSinCodigo"] > 0:
        advertencias.append(f"{doc['documentosSinCodigo']} documentos no tienen codigo y no podran importarse de forma trazable.")
    if doc["documentosDuplicados"]["totalCodigosDuplicados"] > 0:
        advertencias.append(f"{doc['documentosDuplicados']['totalCodigosDuplicados']} codigo(s) estan duplicados; deben resolverse antes de importar.")
    if are["areasVacias"] > 0:
        advertencias.append(f"{are['areasVacias']} documentos no tienen area asignada.")
    if pro["procesosVacios"] > 0:
        advertencias.append(f"{pro['procesosVacios']} documentos no tienen proceso asociado.")
    if resp["documentosSinResponsable"] > 0:
        advertencias.append(f"{resp['documentosSinResponsable']} documentos no tienen ningun responsable asignado.")
    if est["estadosVacios"] > 0:
        advertencias.append(f"{est['estadosVacios']} documentos no tienen estado.")
    if tip["tiposDesconocidos"] > 0:
        advertencias.append(f"{tip['tiposDesconocidos']} documentos tienen un tipo documental no reconocido.")
    if not advertencias:
        advertencias.append("No se identificaron advertencias criticas adicionales.")
    for a in advertencias:
        md.append(f"- {a}")
    md.append("")

    # ---------------- DOCUMENTOS CON MENOR PUNTAJE ----------------
    md.append("## Documentos con menor puntaje de calidad")
    md.append("")
    md.append("| Codigo | Hoja de origen | Puntaje | Checks fallidos |")
    md.append("|---|---|---|---|")
    for item in cal["documentosConMenorPuntaje"]:
        codigo = item["codigoDocumento"] or "(sin codigo)"
        checks_fallidos = ", ".join(item["checksFallidos"]) if item["checksFallidos"] else "-"
        md.append(f"| {codigo} | {item['origenHoja']} | {item['puntaje']}% | {checks_fallidos} |")
    md.append("")

    # ---------------- RECOMENDACIONES ----------------
    md.append("## Recomendaciones")
    md.append("")
    recomendaciones = []
    if doc["documentosSinCodigo"] > 0:
        recomendaciones.append("Asignar codigo unico a todos los documentos antes de continuar con el importador.")
    if doc["documentosDuplicados"]["totalCodigosDuplicados"] > 0:
        recomendaciones.append("Revisar y corregir manualmente los codigos duplicados en el Excel de origen (el Validador no los modifica).")
    if are["areasVacias"] > 0 or pro["procesosVacios"] > 0:
        recomendaciones.append("Completar area y proceso en los documentos que quedaron sin esa informacion, para permitir su vinculacion relacional.")
    if resp["documentosSinResponsable"] > 0:
        recomendaciones.append("Definir responsable de actualizacion o revision para los documentos que no tienen ninguno asignado.")
    if est["estadosVacios"] > 0 or tip["tiposDesconocidos"] > 0:
        recomendaciones.append("Revisar los documentos sin estado o con tipo documental no reconocido antes de definir el mapeo de estados del PMO.")
    if are["areasDuplicadasPorEscritura"] or resp["responsablesRepetidosPorEscritura"]:
        recomendaciones.append("Unificar la escritura de areas y responsables que hoy generan variantes (mayusculas, tildes, espacios) para evitar catalogos fragmentados.")
    if cal["calidadDocumentalPorcentaje"] < 95:
        recomendaciones.append("Priorizar la revision de los documentos con menor puntaje (ver tabla anterior) antes de ejecutar el Importador definitivo.")
    if not recomendaciones:
        recomendaciones.append("La informacion cumple los estandares minimos; se recomienda proceder con la siguiente etapa del pipeline.")
    for rec in recomendaciones:
        md.append(f"- {rec}")
    md.append("")

    md.append("---")
    md.append("")
    md.append(
        "*Este informe fue generado automaticamente por el Validador PMO. No modifica "
        "datos ni corrige informacion; su unico proposito es evaluar si el `json-pmo.json` "
        "esta listo para el Importador definitivo.*"
    )

    return "\n".join(md)


# =====================================================================
# MAIN
# =====================================================================

def main():
    ruta_entrada = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_INPUT
    carpeta_salida = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUTPUT_DIR

    if not os.path.isfile(ruta_entrada):
        print(f"ERROR: no se encontro el archivo de entrada: {ruta_entrada}")
        print("Este script espera el JSON generado por normalizador.py (json-pmo.json).")
        sys.exit(1)

    os.makedirs(carpeta_salida, exist_ok=True)

    with open(ruta_entrada, "r", encoding="utf-8") as f:
        data = json.load(f)

    documentos = data.get("documentos", [])
    catalogos = data.get("catalogos", {})

    resultado_documentos, codigos_duplicados = validar_documentos(documentos)
    resultado_areas = validar_areas(documentos, catalogos.get("areas", []))
    resultado_procesos = validar_procesos(documentos, catalogos.get("procesos", []))
    resultado_responsables = validar_responsables(documentos, catalogos.get("responsablesActualizacion", []), catalogos.get("responsablesRevision", []))
    resultado_estados = validar_estados(documentos)
    resultado_tipos = validar_tipos_documentales(documentos)
    resultado_catalogos = validar_catalogos(catalogos, documentos)
    resultado_calidad, detalle_calidad = calcular_calidad(documentos, codigos_duplicados)

    fecha_generacion = datetime.datetime.now(datetime.timezone.utc).isoformat()

    reporte = {
        "metadata": {
            "fechaGeneracion": fecha_generacion,
            "versionValidador": VERSION_VALIDADOR,
            "archivoAnalizado": os.path.basename(ruta_entrada),
        },
        "documentos": resultado_documentos,
        "areas": resultado_areas,
        "procesos": resultado_procesos,
        "responsables": resultado_responsables,
        "estados": resultado_estados,
        "tiposDocumentales": resultado_tipos,
        "catalogos": resultado_catalogos,
        "calidad": resultado_calidad,
        "detalleCalidadPorDocumento": detalle_calidad,
    }

    ruta_json = os.path.join(carpeta_salida, "reporte-validacion.json")
    with open(ruta_json, "w", encoding="utf-8") as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2)

    markdown = generar_markdown(reporte, fecha_generacion)
    ruta_md = os.path.join(carpeta_salida, "reporte-validacion.md")
    with open(ruta_md, "w", encoding="utf-8") as f:
        f.write(markdown)

    # ---------------- RESUMEN POR CONSOLA ----------------
    print("=" * 70)
    print("VALIDACION PMO COMPLETADA")
    print("=" * 70)
    print(f"Archivo analizado: {ruta_entrada}")
    print(f"Total documentos : {resultado_documentos['totalDocumentos']}")
    print()
    print(f"Calidad documental: {resultado_calidad['calidadDocumentalPorcentaje']}% "
          f"({resultado_calidad['clasificacion']})")
    print()
    print("Documentos:")
    print(f"  Sin codigo             : {resultado_documentos['documentosSinCodigo']}")
    print(f"  Codigos duplicados     : {resultado_documentos['documentosDuplicados']['totalCodigosDuplicados']}")
    print(f"  Sin nombre             : {resultado_documentos['documentosSinNombre']}")
    print(f"  Sin version            : {resultado_documentos['documentosSinVersion']}")
    print(f"  Sin fechas             : {resultado_documentos['documentosSinFechas']}")
    print(f"  Sin tipo documental    : {resultado_documentos['documentosSinTipoDocumental']}")
    print()
    print("Areas:")
    print(f"  Distintas               : {resultado_areas['areasDistintas']}")
    print(f"  Vacias                  : {resultado_areas['areasVacias']}")
    print(f"  Variantes por escritura : {len(resultado_areas['areasDuplicadasPorEscritura'])}")
    print()
    print("Procesos:")
    print(f"  Distintos : {resultado_procesos['procesosDistintos']}")
    print(f"  Vacios    : {resultado_procesos['procesosVacios']}")
    print()
    print("Responsables:")
    print(f"  Distintos               : {resultado_responsables['responsablesDistintos']}")
    print(f"  Documentos sin responsable : {resultado_responsables['documentosSinResponsable']}")
    print(f"  Variantes por escritura  : {len(resultado_responsables['responsablesRepetidosPorEscritura'])}")
    print()
    print("Estados:")
    print(f"  Distintos : {len(resultado_estados['estadosEncontrados'])}")
    print(f"  Vacios    : {resultado_estados['estadosVacios']}")
    print()
    print("Tipos documentales:")
    print(f"  Desconocidos : {resultado_tipos['tiposDesconocidos']}")
    print()
    print("Archivos generados:")
    print(f"  {ruta_json}")
    print(f"  {ruta_md}")


if __name__ == "__main__":
    main()
