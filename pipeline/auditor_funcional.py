#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AUDITOR FUNCIONAL PMO
Componente independiente que complementa al Validador Tecnico.

El Validador Tecnico responde: "¿el JSON esta bien formado?"
El Auditor Funcional responde: "¿la informacion sirve para operar un PMO?"

ENTRADAS (solo lectura):
    json-pmo.json           (salida del Normalizador)
    reporte-validacion.json (salida del Validador Tecnico)

SALIDAS:
    auditoria-funcional.json
    auditoria-funcional.md

No modifica datos. No corrige nada. No importa nada. Solo analiza e
interpreta, como lo haria un consultor funcional implementando un PMO.

Uso:
    python3 auditor_funcional.py [json_pmo] [reporte_validacion] [carpeta_salida]
"""

import sys
import os
import json
import re
import statistics
import unicodedata
import datetime
from collections import Counter, defaultdict
from difflib import SequenceMatcher

# =====================================================================
# CONFIGURACION
# =====================================================================

DEFAULT_JSON_PMO = "/mnt/user-data/outputs/json-pmo.json"
DEFAULT_REPORTE_VALIDACION = "/mnt/user-data/outputs/reporte-validacion.json"
DEFAULT_OUTPUT_DIR = "/mnt/user-data/outputs"
VERSION_AUDITOR = "auditor-funcional-1.0.0"

TIPOS_DOCUMENTALES_CONOCIDOS = {
    "MANUAL", "PROCESO", "PROCEDIMIENTO", "INSTRUCTIVO", "FORMATO", "POLITICA",
}

CLASIFICACIONES_4 = [
    (95, 100, "Excelente"),
    (85, 94.999, "Buena"),
    (70, 84.999, "Aceptable"),
    (0, 69.999, "Critica"),
]

# Palabras que sugieren que un valor de "area" es en realidad un cargo/rol,
# no una unidad organizacional.
PALABRAS_CARGO = {
    "gerente", "director", "directora", "coordinador", "coordinadora",
    "analista", "asistente", "auxiliar", "jefe", "jefa", "supervisor",
    "supervisora", "responsable", "lider", "profesional", "especialista",
    "ejecutivo", "ejecutiva", "representante", "practicante", "consultor",
}

TIPOS_PROBLEMA = {
    "CALIDAD_DATOS": "Calidad de datos",
    "MODELO_DOCUMENTAL": "Modelo documental",
    "CATALOGACION": "Catalogacion",
    "ORGANIZACIONAL": "Organizacional (detectable por los datos)",
}

SEVERIDADES = ["Critico", "Alto", "Medio", "Bajo"]


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
    return texto.strip("-") or None


def clasificar_4(porcentaje):
    for minimo, maximo, etiqueta in CLASIFICACIONES_4:
        if minimo <= porcentaje <= maximo:
            return etiqueta
    return "Critica"


def similitud(a, b):
    return SequenceMatcher(None, a, b).ratio()


def hallazgo(categoria, tipo_problema, severidad, titulo, detalle, evidencia=None, recomendacion=None):
    return {
        "categoria": categoria,
        "tipoProblema": tipo_problema,
        "severidad": severidad,
        "titulo": titulo,
        "detalle": detalle,
        "evidencia": evidencia or [],
        "recomendacionRelacionada": recomendacion,
    }


# =====================================================================
# 1. CALIDAD ESTRUCTURAL — ¿los documentos pueden importarse?
# =====================================================================

def evaluar_calidad_estructural(documentos, codigos_duplicados):
    criterios = ["codigo", "nombre", "tipoDocumental", "area", "estado"]
    scores = []
    for doc in documentos:
        codigo = doc.get("codigoDocumento")
        checks = {
            "codigo": bool(codigo) and codigos_duplicados.get(codigo, 1) <= 1,
            "nombre": bool(doc.get("nombre")),
            "tipoDocumental": bool(doc.get("tipoDocumental")) and doc.get("tipoDocumental") in TIPOS_DOCUMENTALES_CONOCIDOS,
            "area": bool(doc.get("area")),
            "estado": bool(doc.get("estado")),
        }
        scores.append(sum(checks.values()) / len(criterios) * 100)

    promedio = round(sum(scores) / len(scores), 2) if scores else 0.0
    return {
        "porcentaje": promedio,
        "clasificacion": clasificar_4(promedio),
        "criteriosEvaluados": criterios,
        "pregunta": "¿Los documentos pueden importarse?",
    }


# =====================================================================
# 2. CALIDAD DOCUMENTAL — ¿que tan completos estan los documentos?
# =====================================================================

def evaluar_calidad_documental(documentos):
    """
    Evalua version, fechas, observaciones, responsables, vigencia, anexos.
    Si un campo NUNCA existe en el modelo de origen (ninguna clave presente
    en ningun documento), se marca 'No evaluado' y NO penaliza el indice.
    """
    total = len(documentos)

    def existe_clave(claves):
        return any(any(c in doc for c in claves) for doc in documentos)

    def completitud(predicado):
        completos = sum(1 for d in documentos if predicado(d))
        return round(completos / total * 100, 2) if total else 0.0

    campos = {}

    # version
    if existe_clave(["version"]):
        campos["version"] = {
            "evaluado": True,
            "porcentajeCompleto": completitud(lambda d: bool(d.get("version"))),
        }
    else:
        campos["version"] = {"evaluado": False, "motivo": "Campo no existe en el modelo de origen"}

    # fechas (al menos una de las tres)
    if existe_clave(["fechaCreacion", "fechaRevision", "fechaProximaRevision"]):
        campos["fechas"] = {
            "evaluado": True,
            "porcentajeCompleto": completitud(
                lambda d: bool(d.get("fechaCreacion")) or bool(d.get("fechaRevision")) or bool(d.get("fechaProximaRevision"))
            ),
        }
    else:
        campos["fechas"] = {"evaluado": False, "motivo": "Campo no existe en el modelo de origen"}

    # observaciones
    if existe_clave(["observaciones"]):
        campos["observaciones"] = {
            "evaluado": True,
            "porcentajeCompleto": completitud(lambda d: bool(d.get("observaciones"))),
        }
    else:
        campos["observaciones"] = {"evaluado": False, "motivo": "Campo no existe en el modelo de origen"}

    # responsables (al menos uno de los dos)
    if existe_clave(["responsableActualizacion", "responsableRevision"]):
        campos["responsables"] = {
            "evaluado": True,
            "porcentajeCompleto": completitud(
                lambda d: bool(d.get("responsableActualizacion")) or bool(d.get("responsableRevision"))
            ),
        }
    else:
        campos["responsables"] = {"evaluado": False, "motivo": "Campo no existe en el modelo de origen"}

    # vigencia
    if existe_clave(["vigencia"]):
        campos["vigencia"] = {
            "evaluado": True,
            "porcentajeCompleto": completitud(lambda d: bool(d.get("vigencia"))),
        }
    else:
        campos["vigencia"] = {"evaluado": False, "motivo": "Campo no existe en el modelo de origen"}

    # anexos: no existe en el modelo actual (transformador/normalizador no lo capturan)
    if existe_clave(["anexos"]):
        campos["anexos"] = {
            "evaluado": True,
            "porcentajeCompleto": completitud(lambda d: bool(d.get("anexos"))),
        }
    else:
        campos["anexos"] = {"evaluado": False, "motivo": "Campo no existe en el modelo de origen (Excel no lo contempla)"}

    evaluados = [c["porcentajeCompleto"] for c in campos.values() if c["evaluado"]]
    indice = round(sum(evaluados) / len(evaluados), 2) if evaluados else 0.0

    return {
        "porcentaje": indice,
        "clasificacion": clasificar_4(indice),
        "pregunta": "¿Que tan completos estan los documentos?",
        "campos": campos,
        "nota": "Los campos marcados como 'No evaluado' no existen en el modelo de origen y no penalizan el indice.",
    }


# =====================================================================
# 3. CALIDAD RELACIONAL — ¿que tan preparados estan para integrarse al PMO?
# =====================================================================

def evaluar_calidad_relacional(documentos, reporte_validacion):
    total = len(documentos)

    def pct(predicado):
        return round(sum(1 for d in documentos if predicado(d)) / total * 100, 2) if total else 0.0

    campos = {
        "area": pct(lambda d: bool(d.get("area"))),
        "proceso": pct(lambda d: bool(d.get("proceso"))),
        "tipoDocumental": pct(lambda d: bool(d.get("tipoDocumental")) and d.get("tipoDocumental") in TIPOS_DOCUMENTALES_CONOCIDOS),
        "responsables": pct(lambda d: bool(d.get("responsableActualizacion")) or bool(d.get("responsableRevision"))),
        "estados": pct(lambda d: bool(d.get("estado"))),
        "codigos": pct(lambda d: bool(d.get("codigoDocumento"))),
    }

    indice = round(sum(campos.values()) / len(campos), 2)

    return {
        "porcentaje": indice,
        "clasificacion": clasificar_4(indice),
        "pregunta": "¿Que tan preparados estan los documentos para integrarse al PMO?",
        "camposEvaluados": campos,
        "catalogosReferenciados": {
            "areasDistintas": reporte_validacion.get("areas", {}).get("areasDistintas"),
            "procesosDistintos": reporte_validacion.get("procesos", {}).get("procesosDistintos"),
            "responsablesDistintos": reporte_validacion.get("responsables", {}).get("responsablesDistintos"),
            "estadosDistintos": len(reporte_validacion.get("estados", {}).get("estadosEncontrados", [])),
        },
    }


# =====================================================================
# 4. MADUREZ DOCUMENTAL — clasificacion por documento (Nivel 1 a 5)
# =====================================================================

def nivel_madurez(doc, codigos_duplicados):
    codigo = doc.get("codigoDocumento")
    tiene_codigo_unico = bool(codigo) and codigos_duplicados.get(codigo, 1) <= 1
    tiene_nombre = bool(doc.get("nombre"))
    tiene_tipo = bool(doc.get("tipoDocumental")) and doc.get("tipoDocumental") in TIPOS_DOCUMENTALES_CONOCIDOS
    tiene_area = bool(doc.get("area"))
    tiene_estado = bool(doc.get("estado"))
    tiene_proceso = bool(doc.get("proceso"))
    tiene_responsable = bool(doc.get("responsableActualizacion")) or bool(doc.get("responsableRevision"))
    tiene_version = bool(doc.get("version"))
    tiene_fecha = bool(doc.get("fechaCreacion")) or bool(doc.get("fechaRevision")) or bool(doc.get("fechaProximaRevision"))
    tiene_vigencia = bool(doc.get("vigencia"))

    # Nivel 0: ni siquiera tiene nombre -> registro practicamente vacio
    if not tiene_nombre:
        return 0, "Documento sin nombre: no alcanza el nivel minimo (registro incompleto)."

    # Nivel 1: Documento minimo -> tiene nombre y tipo documental
    nivel = 1
    razon = "Tiene nombre y tipo documental, pero le falta identificacion formal (codigo/area)."
    if not tiene_tipo:
        return 1, "Solo tiene nombre; falta tipo documental para avanzar de nivel."

    # Nivel 2: Documento identificado -> + codigo unico + area
    if tiene_codigo_unico and tiene_area:
        nivel = 2
        razon = "Tiene codigo unico y area asignada, pero no esta controlado (falta estado/proceso)."
    else:
        return nivel, razon

    # Nivel 3: Documento controlado -> + estado + proceso
    if tiene_estado and tiene_proceso:
        nivel = 3
        razon = "Tiene estado y proceso asociado, pero no esta plenamente gestionado (falta responsable/version)."
    else:
        return nivel, razon

    # Nivel 4: Documento gestionado -> + responsable + version
    if tiene_responsable and tiene_version:
        nivel = 4
        razon = "Tiene responsable y version, pero le falta trazabilidad temporal para auditoria (fecha/vigencia)."
    else:
        return nivel, razon

    # Nivel 5: Listo para auditoria -> + fecha + vigencia
    if tiene_fecha and tiene_vigencia:
        nivel = 5
        razon = "Cumple todos los criterios: identificado, controlado, gestionado y trazable en el tiempo."

    return nivel, razon


NOMBRES_NIVEL = {
    0: "Nivel 0 - Registro incompleto",
    1: "Nivel 1 - Documento minimo",
    2: "Nivel 2 - Documento identificado",
    3: "Nivel 3 - Documento controlado",
    4: "Nivel 4 - Documento gestionado",
    5: "Nivel 5 - Documento listo para auditoria",
}


def evaluar_madurez_documental(documentos, codigos_duplicados):
    distribucion = Counter()
    detalle = []
    for doc in documentos:
        nivel, razon = nivel_madurez(doc, codigos_duplicados)
        distribucion[nivel] += 1
        detalle.append({
            "codigoDocumento": doc.get("codigoDocumento"),
            "origenHoja": doc.get("metadata", {}).get("origenHoja"),
            "nivel": nivel,
            "nivelNombre": NOMBRES_NIVEL[nivel],
            "razon": razon,
        })

    total = len(documentos)
    resumen = [
        {"nivel": n, "nombre": NOMBRES_NIVEL[n], "cantidad": distribucion.get(n, 0),
         "porcentaje": round(distribucion.get(n, 0) / total * 100, 2) if total else 0.0}
        for n in range(0, 6)
    ]

    nivel_promedio = round(sum(d["nivel"] for d in detalle) / total, 2) if total else 0.0
    listos_auditoria = distribucion.get(5, 0)

    return {
        "reglas": {
            0: "Sin nombre.",
            1: "Nombre + tipo documental.",
            2: "Nivel 1 + codigo unico + area.",
            3: "Nivel 2 + estado + proceso.",
            4: "Nivel 3 + responsable + version.",
            5: "Nivel 4 + al menos una fecha + vigencia.",
        },
        "distribucion": resumen,
        "nivelPromedio": nivel_promedio,
        "documentosListosParaAuditoria": listos_auditoria,
        "porcentajeListosParaAuditoria": round(listos_auditoria / total * 100, 2) if total else 0.0,
        "detallePorDocumento": detalle,
    }


# =====================================================================
# 5. AUDITORIA FUNCIONAL — observaciones interpretativas
# =====================================================================

def auditar_columna_area_vs_cargo(documentos):
    areas = [d.get("area") for d in documentos if d.get("area")]
    distintas = set(areas)
    parecen_cargo = [a for a in distintas if any(
        p in slugify(a).split("-") for p in PALABRAS_CARGO
    )]
    hallazgos = []
    if distintas:
        ratio = len(parecen_cargo) / len(distintas)
        if ratio >= 0.15:
            hallazgos.append(hallazgo(
                categoria="Modelo de datos: Area vs Cargo",
                tipo_problema=TIPOS_PROBLEMA["MODELO_DOCUMENTAL"],
                severidad="Alto" if ratio >= 0.35 else "Medio",
                titulo="La columna 'Area' parece mezclar cargos con unidades organizacionales",
                detalle=(
                    f"{len(parecen_cargo)} de {len(distintas)} valores distintos de 'area' "
                    f"({round(ratio*100,1)}%) contienen palabras propias de un cargo/rol "
                    "(ej. Gerente, Coordinador, Analista) en vez de una unidad organizacional. "
                    "Esto sugiere que la columna del Excel se uso indistintamente para "
                    "'Area / Cargo', lo cual complicara construir un catalogo limpio de Areas."
                ),
                evidencia=sorted(parecen_cargo)[:15],
                recomendacion="Normalizar nombres de areas",
            ))
    return hallazgos


def auditar_jerarquia_area(documentos):
    areas = [d.get("area") for d in documentos if d.get("area")]
    if not areas:
        return []
    con_jerarquia = [a for a in areas if "/" in a or " - " in a]
    ratio = len(con_jerarquia) / len(areas)
    hallazgos = []
    if 0.05 < ratio < 0.85:
        hallazgos.append(hallazgo(
            categoria="Modelo de datos: jerarquia de Area",
            tipo_problema=TIPOS_PROBLEMA["MODELO_DOCUMENTAL"],
            severidad="Medio",
            titulo="La columna 'Area' mezcla niveles jerarquicos con nombres simples",
            detalle=(
                f"{len(con_jerarquia)} de {len(areas)} valores de area ({round(ratio*100,1)}%) "
                "incluyen una estructura de dependencia (ej. 'Direccion X / Area Y'), mientras "
                "que el resto son nombres simples de un solo nivel. Esto indica que el Excel no "
                "sigue una convencion unica para representar la jerarquia organizacional."
            ),
            evidencia=sorted(set(con_jerarquia))[:10],
            recomendacion="Normalizar nombres de areas",
        ))
    return hallazgos


def auditar_estados_similares(reporte_validacion):
    estados = reporte_validacion.get("estados", {}).get("estadosEncontrados", [])
    pares = []
    for i in range(len(estados)):
        for j in range(i + 1, len(estados)):
            a, b = estados[i], estados[j]
            if slugify(a) == slugify(b):
                continue  # eso ya lo cubre el Validador Tecnico como variante de escritura
            r = similitud(slugify(a) or "", slugify(b) or "")
            if r >= 0.55:
                pares.append({"estadoA": a, "estadoB": b, "similitud": round(r, 2)})

    hallazgos = []
    if pares:
        hallazgos.append(hallazgo(
            categoria="Catalogo de Estados",
            tipo_problema=TIPOS_PROBLEMA["CATALOGACION"],
            severidad="Medio",
            titulo="Existen estados con nombres muy similares que podrian representar el mismo concepto",
            detalle=(
                f"Se detectaron {len(pares)} par(es) de estados con alta similitud textual "
                "(distintos del catalogo, no simples variantes de escritura). Antes de mapear "
                "los estados al PMO, conviene confirmar con el negocio si representan lo mismo."
            ),
            evidencia=[f"'{p['estadoA']}' ~ '{p['estadoB']}' (similitud {p['similitud']})" for p in pares[:10]],
            recomendacion="Mapear estados",
        ))
    return hallazgos


def auditar_tamano_catalogos(documentos, reporte_validacion):
    hallazgos = []
    total = len(documentos)

    # Areas: distintas vs ocurrencias con valor
    areas_info = reporte_validacion.get("areas", {})
    ocurrencias_area = areas_info.get("totalOcurrencias", 0)
    distintas_area = areas_info.get("areasDistintas", 0)
    if ocurrencias_area > 0:
        ratio = distintas_area / ocurrencias_area
        if ratio >= 0.4:
            hallazgos.append(hallazgo(
                categoria="Catalogo de Areas",
                tipo_problema=TIPOS_PROBLEMA["CATALOGACION"],
                severidad="Medio",
                titulo="El catalogo de Areas esta fragmentado (demasiado grande respecto al uso)",
                detalle=(
                    f"Hay {distintas_area} areas distintas para solo {ocurrencias_area} documentos "
                    f"que tienen area asignada (ratio {round(ratio,2)}). Un catalogo tan disperso "
                    "sugiere areas escritas de forma no estandar, o una estructura organizacional "
                    "capturada a nivel de detalle excesivo para un catalogo maestro."
                ),
                recomendacion="Normalizar nombres de areas",
            ))

    procesos_info = reporte_validacion.get("procesos", {})
    ocurrencias_proceso = procesos_info.get("totalOcurrencias", 0)
    distintos_proceso = procesos_info.get("procesosDistintos", 0)
    if ocurrencias_proceso > 0:
        ratio = distintos_proceso / ocurrencias_proceso
        if ratio >= 0.4:
            hallazgos.append(hallazgo(
                categoria="Catalogo de Procesos",
                tipo_problema=TIPOS_PROBLEMA["CATALOGACION"],
                severidad="Medio",
                titulo="El catalogo de Procesos esta fragmentado respecto a su uso real",
                detalle=(
                    f"Hay {distintos_proceso} procesos distintos para solo {ocurrencias_proceso} "
                    f"documentos con proceso asignado (ratio {round(ratio,2)})."
                ),
                recomendacion="Mapear estados",
            ))

    # Tipos documentales: si solo hay 1 tipo con muchos documentos, catalogo sospechosamente chico
    tipos_info = reporte_validacion.get("tiposDocumentales", {})
    cantidad_por_tipo = tipos_info.get("cantidadPorTipo", [])
    if len(cantidad_por_tipo) <= 1 and total > 20:
        hallazgos.append(hallazgo(
            categoria="Catalogo de Tipos Documentales",
            tipo_problema=TIPOS_PROBLEMA["CATALOGACION"],
            severidad="Bajo",
            titulo="El catalogo de Tipos Documentales es sospechosamente pequeño",
            detalle=f"Solo se identifico {len(cantidad_por_tipo)} tipo documental para {total} documentos.",
            recomendacion="Completar metadatos",
        ))

    return hallazgos


def auditar_procesos_y_areas_sin_documentos(documentos):
    """
    Compara los 'procesos' definidos como documentos de tipo PROCESO (su nombre)
    contra los valores de 'proceso' referenciados por el resto de documentos.
    """
    hallazgos = []

    procesos_definidos = {
        d.get("nombre") for d in documentos
        if d.get("tipoDocumental") == "PROCESO" and d.get("nombre")
    }
    procesos_referenciados = {
        d.get("proceso") for d in documentos if d.get("proceso")
    }

    if procesos_definidos:
        sin_uso = procesos_definidos - {slugify(p) and p for p in procesos_referenciados}
        # comparacion flexible por clave, no por texto exacto
        claves_referenciadas = {slugify(p) for p in procesos_referenciados}
        sin_uso = [p for p in procesos_definidos if slugify(p) not in claves_referenciadas]
        if sin_uso:
            hallazgos.append(hallazgo(
                categoria="Procesos sin documentos asociados",
                tipo_problema=TIPOS_PROBLEMA["ORGANIZACIONAL"],
                severidad="Medio",
                titulo="Existen procesos definidos que ningun documento referencia",
                detalle=(
                    f"{len(sin_uso)} de {len(procesos_definidos)} procesos definidos en la hoja "
                    "de Procesos no aparecen como 'Proceso Asociado' en ningun manual, "
                    "procedimiento, instructivo, formato o politica. Puede indicar procesos "
                    "definidos formalmente pero sin documentacion operativa desarrollada aun."
                ),
                evidencia=sorted(sin_uso)[:15],
                recomendacion="Completar metadatos",
            ))

    return hallazgos


def auditar_carga_responsables(documentos):
    hallazgos = []
    conteo = Counter()
    for d in documentos:
        for campo in ("responsableActualizacion", "responsableRevision"):
            v = d.get(campo)
            if v:
                conteo[v] += 1

    if not conteo:
        return hallazgos

    valores = list(conteo.values())
    promedio = statistics.mean(valores)
    desviacion = statistics.pstdev(valores) if len(valores) > 1 else 0

    con_un_solo_documento = [r for r, n in conteo.items() if n == 1]
    if len(con_un_solo_documento) / len(conteo) >= 0.5:
        hallazgos.append(hallazgo(
            categoria="Responsables con baja cobertura",
            tipo_problema=TIPOS_PROBLEMA["ORGANIZACIONAL"],
            severidad="Bajo",
            titulo="La mayoria de los responsables solo aparece en un documento",
            detalle=(
                f"{len(con_un_solo_documento)} de {len(conteo)} responsables distintos "
                "(≥50%) estan vinculados a un unico documento. Esto puede ser normal en "
                "estructuras muy distribuidas, o puede indicar responsables capturados con "
                "variaciones de escritura que fragmentan al mismo responsable en varias entradas."
            ),
            recomendacion="Completar responsables",
        ))

    umbral_sobrecarga = promedio + 2 * desviacion if desviacion > 0 else promedio * 3
    sobrecargados = {r: n for r, n in conteo.items() if n > umbral_sobrecarga and n >= 5}
    if sobrecargados:
        hallazgos.append(hallazgo(
            categoria="Responsables sobrecargados",
            tipo_problema=TIPOS_PROBLEMA["ORGANIZACIONAL"],
            severidad="Alto",
            titulo="Uno o mas responsables concentran una cantidad desproporcionada de documentos",
            detalle=(
                f"El promedio de documentos por responsable es {round(promedio,1)}. "
                f"Se detectaron {len(sobrecargados)} responsable(s) muy por encima de ese "
                "promedio, lo que representa un riesgo de dependencia de una sola persona "
                "para mantener la biblioteca documental."
            ),
            evidencia=[f"{r}: {n} documentos" for r, n in sorted(sobrecargados.items(), key=lambda x: -x[1])],
            recomendacion="Completar responsables",
        ))

    return hallazgos


def auditar_tipos_poco_utilizados(documentos, reporte_validacion):
    hallazgos = []
    total = len(documentos)
    cantidad_por_tipo = reporte_validacion.get("tiposDocumentales", {}).get("cantidadPorTipo", [])
    poco_usados = [item for item in cantidad_por_tipo if total and item["cantidad"] / total < 0.03]
    if poco_usados:
        hallazgos.append(hallazgo(
            categoria="Tipos documentales poco utilizados",
            tipo_problema=TIPOS_PROBLEMA["ORGANIZACIONAL"],
            severidad="Bajo",
            titulo="Algunos tipos documentales representan una fraccion minima del total",
            detalle=(
                "Estos tipos documentales tienen muy pocos documentos respecto al total; "
                "vale la pena confirmar si es un tipo documental en construccion o si "
                "deberia fusionarse con otro."
            ),
            evidencia=[f"{item['tipo']}: {item['cantidad']} documentos" for item in poco_usados],
            recomendacion="Completar metadatos",
        ))
    return hallazgos


def auditar_patrones_codigo(documentos):
    hallazgos = []
    por_tipo = defaultdict(list)
    for d in documentos:
        codigo = d.get("codigoDocumento")
        tipo = d.get("tipoDocumental")
        if codigo and tipo:
            m = re.match(r"^([A-Za-zÀ-ÿ]+)", codigo)
            prefijo = m.group(1).upper() if m else None
            por_tipo[tipo].append((codigo, prefijo))

    for tipo, pares in por_tipo.items():
        prefijos = [p for _, p in pares if p]
        if not prefijos:
            continue
        conteo_prefijos = Counter(prefijos)
        dominante, n_dominante = conteo_prefijos.most_common(1)[0]
        inconsistentes = [c for c, p in pares if p != dominante]
        ratio = len(inconsistentes) / len(pares)
        if ratio >= 0.15 and len(inconsistentes) >= 2:
            hallazgos.append(hallazgo(
                categoria=f"Patron de codigo - {tipo}",
                tipo_problema=TIPOS_PROBLEMA["CATALOGACION"],
                severidad="Bajo" if ratio < 0.4 else "Medio",
                titulo=f"Los codigos de tipo {tipo} no siguen un prefijo consistente",
                detalle=(
                    f"El prefijo predominante para {tipo} es '{dominante}' "
                    f"({n_dominante} de {len(pares)} documentos), pero {len(inconsistentes)} "
                    f"codigo(s) ({round(ratio*100,1)}%) usan un prefijo distinto."
                ),
                evidencia=sorted(inconsistentes)[:15],
                recomendacion="Normalizar nombres de areas",
            ))
    return hallazgos


def ejecutar_auditoria_funcional(documentos, reporte_validacion):
    hallazgos = []
    hallazgos += auditar_columna_area_vs_cargo(documentos)
    hallazgos += auditar_jerarquia_area(documentos)
    hallazgos += auditar_estados_similares(reporte_validacion)
    hallazgos += auditar_tamano_catalogos(documentos, reporte_validacion)
    hallazgos += auditar_procesos_y_areas_sin_documentos(documentos)
    hallazgos += auditar_carga_responsables(documentos)
    hallazgos += auditar_tipos_poco_utilizados(documentos, reporte_validacion)
    hallazgos += auditar_patrones_codigo(documentos)

    # ---- hallazgos estructurales tomados del Validador Tecnico, pero
    # reinterpretados con severidad e impacto funcional ----
    doc_info = reporte_validacion.get("documentos", {})
    total = doc_info.get("totalDocumentos", len(documentos)) or 1

    duplicados = doc_info.get("documentosDuplicados", {})
    if duplicados.get("totalCodigosDuplicados", 0) > 0:
        hallazgos.append(hallazgo(
            categoria="Codigos duplicados",
            tipo_problema=TIPOS_PROBLEMA["CALIDAD_DATOS"],
            severidad="Critico",
            titulo="Existen codigos de documento duplicados",
            detalle=(
                f"{duplicados['totalCodigosDuplicados']} codigo(s) estan duplicados. "
                "Un codigo duplicado rompe la unicidad requerida para importar y para "
                "cualquier trazabilidad posterior del documento."
            ),
            evidencia=[f"{d['codigoDocumento']} ({d['apariciones']} apariciones)" for d in duplicados.get("detalle", [])],
            recomendacion="Corregir codigos duplicados",
        ))

    sin_codigo = doc_info.get("documentosSinCodigo", 0)
    if sin_codigo > 0:
        ratio = sin_codigo / total
        hallazgos.append(hallazgo(
            categoria="Documentos sin codigo",
            tipo_problema=TIPOS_PROBLEMA["CALIDAD_DATOS"],
            severidad="Alto" if ratio >= 0.2 else "Medio",
            titulo="Hay documentos sin codigo asignado",
            detalle=(
                f"{sin_codigo} de {total} documentos ({round(ratio*100,1)}%) no tienen codigo. "
                "No podran importarse de forma trazable mientras no se les asigne uno."
            ),
            recomendacion="Corregir codigos duplicados",
        ))

    sin_responsable = reporte_validacion.get("responsables", {}).get("documentosSinResponsable", 0)
    if sin_responsable > 0:
        ratio = sin_responsable / total
        hallazgos.append(hallazgo(
            categoria="Documentos sin responsable",
            tipo_problema=TIPOS_PROBLEMA["CALIDAD_DATOS"],
            severidad="Alto" if ratio >= 0.5 else "Medio",
            titulo="Un porcentaje relevante de documentos no tiene responsable asignado",
            detalle=(
                f"{sin_responsable} de {total} documentos ({round(ratio*100,1)}%) no tienen "
                "responsable de actualizacion ni de revision. Sin responsable, el PMO no "
                "puede operar el ciclo de vida del documento (quien lo actualiza, quien lo aprueba)."
            ),
            recomendacion="Completar responsables",
        ))

    estados_vacios = reporte_validacion.get("estados", {}).get("estadosVacios", 0)
    if estados_vacios > 0:
        hallazgos.append(hallazgo(
            categoria="Documentos sin estado",
            tipo_problema=TIPOS_PROBLEMA["CALIDAD_DATOS"],
            severidad="Medio",
            titulo="Hay documentos sin estado documental",
            detalle=f"{estados_vacios} documentos no tienen estado registrado en el Excel.",
            recomendacion="Mapear estados",
        ))

    # variantes ortograficas ya detectadas por el Validador Tecnico (areas/responsables)
    for categoria_amistosa, bloque in (("Areas", reporte_validacion.get("areas", {})),
                                        ("Responsables", reporte_validacion.get("responsables", {}))):
        variantes = bloque.get("areasDuplicadasPorEscritura") or bloque.get("responsablesRepetidosPorEscritura") or []
        if variantes:
            hallazgos.append(hallazgo(
                categoria=f"Variantes ortograficas en {categoria_amistosa}",
                tipo_problema=TIPOS_PROBLEMA["CATALOGACION"],
                severidad="Bajo",
                titulo=f"Existen variantes de escritura para el mismo valor en {categoria_amistosa}",
                detalle=(
                    f"Se detectaron {len(variantes)} caso(s) donde el mismo concepto de "
                    f"{categoria_amistosa.lower()} esta escrito de mas de una forma "
                    "(mayusculas, tildes, espacios), fragmentando el catalogo."
                ),
                evidencia=[f"{v['clave']}: {', '.join(v['variantes'])}" for v in variantes[:10]],
                recomendacion="Normalizar nombres de areas",
            ))

    return hallazgos


# =====================================================================
# 6. MATRIZ DE RIESGO
# =====================================================================

def construir_matriz_riesgo(hallazgos):
    matriz = {s: [] for s in SEVERIDADES}
    for h in hallazgos:
        matriz[h["severidad"]].append({
            "categoria": h["categoria"],
            "titulo": h["titulo"],
            "tipoProblema": h["tipoProblema"],
        })
    resumen = {s: len(matriz[s]) for s in SEVERIDADES}
    return {"resumen": resumen, "detalle": matriz}


# =====================================================================
# 7. RECOMENDACIONES PRIORIZADAS
# =====================================================================

def construir_recomendaciones(hallazgos):
    peso_severidad = {"Critico": 4, "Alto": 3, "Medio": 2, "Bajo": 1}

    agrupadas = defaultdict(lambda: {"cuenta": 0, "peso": 0, "severidadMaxima": "Bajo", "tiposProblema": set()})
    for h in hallazgos:
        clave = h["recomendacionRelacionada"] or h["titulo"]
        bucket = agrupadas[clave]
        bucket["cuenta"] += 1
        bucket["peso"] += peso_severidad[h["severidad"]]
        bucket["tiposProblema"].add(h["tipoProblema"])
        if peso_severidad[h["severidad"]] > peso_severidad[bucket["severidadMaxima"]]:
            bucket["severidadMaxima"] = h["severidad"]

    # Orden de prioridad: primero por severidad maxima (Critico > Alto > Medio > Bajo),
    # y dentro de la misma severidad, por el peso acumulado (cantidad e impacto de hallazgos).
    ordenadas = sorted(
        agrupadas.items(),
        key=lambda kv: (-peso_severidad[kv[1]["severidadMaxima"]], -kv[1]["peso"])
    )

    recomendaciones = []
    for i, (titulo, info) in enumerate(ordenadas, start=1):
        recomendaciones.append({
            "prioridad": i,
            "accion": titulo,
            "severidadMaxima": info["severidadMaxima"],
            "hallazgosRelacionados": info["cuenta"],
            "tiposProblema": sorted(info["tiposProblema"]),
        })
    return recomendaciones


# =====================================================================
# REPORTE MARKDOWN
# =====================================================================

def generar_markdown(auditoria, fecha_generacion):
    a = auditoria
    est = a["calidadEstructural"]
    doc = a["calidadDocumental"]
    rel = a["calidadRelacional"]
    mad = a["madurezDocumental"]
    riesgo = a["matrizRiesgo"]
    recos = a["recomendaciones"]
    hallazgos = a["hallazgosFuncionales"]
    total_docs = a["metadata"]["totalDocumentos"]

    md = []
    md.append("# Auditoria Funcional PMO — Biblioteca Documental")
    md.append("")
    md.append(f"**Fecha de generacion:** {fecha_generacion}  ")
    md.append(f"**Documentos analizados:** {total_docs}  ")
    md.append(f"**Version del auditor:** {VERSION_AUDITOR}")
    md.append("")
    md.append(
        "> Este informe complementa al Validador Tecnico. Mientras el Validador confirma "
        "que el JSON esta bien formado, esta Auditoria evalua si la informacion es "
        "funcionalmente util para operar un PMO."
    )
    md.append("")
    md.append("---")
    md.append("")

    # ---------------- RESUMEN EJECUTIVO ----------------
    md.append("## Resumen ejecutivo")
    md.append("")
    md.append(
        f"La biblioteca documental analizada contiene **{total_docs} documentos**. "
        f"La calidad estructural (¿pueden importarse?) es **{est['porcentaje']}% — {est['clasificacion']}**. "
        f"La completitud documental (¿que tan llenos estan los campos?) es **{doc['porcentaje']}% — {doc['clasificacion']}**. "
        f"La preparacion relacional (¿pueden vincularse a catalogos del PMO?) es **{rel['porcentaje']}% — {rel['clasificacion']}**. "
        f"El nivel de madurez documental promedio es **{mad['nivelPromedio']} de 5**, y solo "
        f"**{mad['porcentajeListosParaAuditoria']}%** de los documentos estan listos para auditoria (Nivel 5)."
    )
    md.append("")
    md.append("| Dimension | Pregunta que responde | Resultado | Clasificacion |")
    md.append("|---|---|---|---|")
    md.append(f"| Calidad estructural | {est['pregunta']} | {est['porcentaje']}% | {est['clasificacion']} |")
    md.append(f"| Calidad documental | {doc['pregunta']} | {doc['porcentaje']}% | {doc['clasificacion']} |")
    md.append(f"| Calidad relacional | {rel['pregunta']} | {rel['porcentaje']}% | {rel['clasificacion']} |")
    md.append(f"| Madurez documental (promedio) | ¿Que tan maduro es el ciclo de vida documental? | {mad['nivelPromedio']} / 5 | — |")
    md.append("")

    # ---------------- FORTALEZAS Y DEBILIDADES ----------------
    md.append("## Fortalezas")
    md.append("")
    fortalezas = []
    if rel["camposEvaluados"]["tipoDocumental"] >= 90:
        fortalezas.append("El tipo documental esta correctamente identificado en casi todos los documentos (heredado automaticamente del nombre de hoja).")
    if not any(h["categoria"].startswith("Variantes ortograficas en Responsables") for h in hallazgos):
        fortalezas.append("No se detectaron variantes ortograficas relevantes en los nombres de responsables.")
    if est["porcentaje"] >= 70:
        fortalezas.append("La estructura basica de identificacion (codigo, nombre, tipo, area, estado) tiene una cobertura aceptable o superior.")
    if not fortalezas:
        fortalezas.append("No se identificaron fortalezas destacables por encima del promedio en esta version del Excel; el foco debe estar en cerrar las brechas descritas abajo.")
    for f in fortalezas:
        md.append(f"- {f}")
    md.append("")

    md.append("## Debilidades")
    md.append("")
    debilidades = []
    if doc["porcentaje"] < 70:
        debilidades.append(f"La completitud documental es baja ({doc['porcentaje']}%): muchos documentos carecen de version, fechas o responsables.")
    if rel["camposEvaluados"]["proceso"] < 50:
        debilidades.append(f"Solo el {rel['camposEvaluados']['proceso']}% de los documentos tiene un proceso asociado, lo que limita severamente la trazabilidad por proceso.")
    if mad["porcentajeListosParaAuditoria"] < 20:
        debilidades.append(f"Apenas el {mad['porcentajeListosParaAuditoria']}% de los documentos alcanza el nivel de madurez maximo (listo para auditoria).")
    if any(h["severidad"] == "Critico" for h in hallazgos):
        debilidades.append("Existen hallazgos de severidad Critica que deben resolverse antes de continuar el pipeline.")
    if not debilidades:
        debilidades.append("No se identificaron debilidades criticas adicionales a las descritas en los hallazgos.")
    for d in debilidades:
        md.append(f"- {d}")
    md.append("")

    # ---------------- HALLAZGOS ----------------
    md.append("## Hallazgos funcionales")
    md.append("")
    if hallazgos:
        md.append("| Severidad | Categoria | Tipo de problema | Hallazgo |")
        md.append("|---|---|---|---|")
        for h in sorted(hallazgos, key=lambda x: SEVERIDADES.index(x["severidad"])):
            md.append(f"| {h['severidad']} | {h['categoria']} | {h['tipoProblema']} | {h['titulo']} |")
        md.append("")
        md.append("### Detalle de hallazgos")
        md.append("")
        for h in sorted(hallazgos, key=lambda x: SEVERIDADES.index(x["severidad"])):
            md.append(f"**[{h['severidad']}] {h['titulo']}**  ")
            md.append(f"*Categoria:* {h['categoria']} — *Tipo de problema:* {h['tipoProblema']}")
            md.append("")
            md.append(h["detalle"])
            if h["evidencia"]:
                md.append("")
                md.append("Evidencia:")
                for e in h["evidencia"][:10]:
                    md.append(f"  - {e}")
            md.append("")
    else:
        md.append("No se identificaron hallazgos funcionales relevantes.")
        md.append("")

    # ---------------- RIESGOS ----------------
    md.append("## Matriz de riesgo")
    md.append("")
    md.append("| Severidad | Cantidad de hallazgos |")
    md.append("|---|---|")
    for s in SEVERIDADES:
        md.append(f"| {s} | {riesgo['resumen'][s]} |")
    md.append("")

    # ---------------- MADUREZ DOCUMENTAL ----------------
    md.append("## Madurez documental")
    md.append("")
    md.append("| Nivel | Descripcion | Documentos | % |")
    md.append("|---|---|---|---|")
    for item in mad["distribucion"]:
        md.append(f"| {item['nivel']} | {item['nombre']} | {item['cantidad']} | {item['porcentaje']}% |")
    md.append("")
    md.append("**Reglas de clasificacion:**")
    md.append("")
    for nivel, regla in mad["reglas"].items():
        md.append(f"- Nivel {nivel}: {regla}")
    md.append("")

    # ---------------- ESTADO GENERAL / PREPARACION ----------------
    md.append("## Estado general del proyecto")
    md.append("")
    promedio_general = round((est["porcentaje"] + doc["porcentaje"] + rel["porcentaje"]) / 3, 2)
    clasificacion_general = clasificar_4(promedio_general)
    md.append(
        f"El indice combinado de las tres dimensiones estructurales/documentales/relacionales "
        f"es **{promedio_general}%**, lo que ubica al proyecto en un estado **{clasificacion_general}** "
        "respecto a los estandares tipicos de implementacion de un PMO documental."
    )
    md.append("")

    md.append("## Nivel de preparacion para importar")
    md.append("")
    if riesgo["resumen"]["Critico"] > 0:
        md.append(
            f"**No se recomienda ejecutar el Importador todavia.** Existen "
            f"{riesgo['resumen']['Critico']} hallazgo(s) de severidad Critica "
            "(por ejemplo, codigos duplicados) que deben resolverse primero."
        )
    elif riesgo["resumen"]["Alto"] > 2:
        md.append(
            f"**Preparacion parcial.** No hay hallazgos criticos, pero existen "
            f"{riesgo['resumen']['Alto']} hallazgos de severidad Alta que conviene resolver "
            "antes de una migracion masiva; una importacion piloto por hoja/tipo documental "
            "es una alternativa razonable."
        )
    else:
        md.append(
            "**Preparacion aceptable.** No hay hallazgos criticos y los hallazgos de severidad "
            "alta son manejables; se puede planear la importacion en paralelo a la resolucion "
            "de los hallazgos de severidad media y baja."
        )
    md.append("")

    # ---------------- ROADMAP ----------------
    md.append("## Roadmap recomendado")
    md.append("")
    for r in recos:
        md.append(
            f"**Prioridad {r['prioridad']}** — {r['accion']} "
            f"(severidad maxima: {r['severidadMaxima']}, {r['hallazgosRelacionados']} hallazgo(s) relacionado(s))"
        )
    md.append("")

    # ---------------- CONCLUSION ----------------
    md.append("## Conclusion ejecutiva")
    md.append("")
    md.append(
        f"La informacion actual refleja un proceso documental en construccion: el pipeline "
        f"tecnico (Transformador, Normalizador, Validador) funciona correctamente, pero el "
        f"contenido del Excel de origen todavia no cumple los estandares funcionales de un "
        f"PMO maduro (madurez promedio {mad['nivelPromedio']}/5). Se recomienda ejecutar el "
        f"roadmap anterior, priorizando los hallazgos criticos y altos, antes de construir el "
        f"Resolutor de Catalogos y el Importador definitivo."
    )
    md.append("")
    md.append("---")
    md.append("")
    md.append(
        "*Este informe fue generado automaticamente por el Auditor Funcional PMO. No "
        "modifica datos ni corrige informacion; su unico proposito es interpretar la calidad "
        "funcional del `json-pmo.json` antes de una migracion documental.*"
    )

    return "\n".join(md)


# =====================================================================
# MAIN
# =====================================================================

def main():
    ruta_json_pmo = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_JSON_PMO
    ruta_reporte_validacion = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_REPORTE_VALIDACION
    carpeta_salida = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_OUTPUT_DIR

    for ruta in (ruta_json_pmo, ruta_reporte_validacion):
        if not os.path.isfile(ruta):
            print(f"ERROR: no se encontro el archivo de entrada: {ruta}")
            sys.exit(1)

    os.makedirs(carpeta_salida, exist_ok=True)

    with open(ruta_json_pmo, "r", encoding="utf-8") as f:
        json_pmo = json.load(f)
    with open(ruta_reporte_validacion, "r", encoding="utf-8") as f:
        reporte_validacion = json.load(f)

    documentos = json_pmo.get("documentos", [])

    codigos_duplicados = {
        item["codigoDocumento"]: item["apariciones"]
        for item in reporte_validacion.get("documentos", {}).get("documentosDuplicados", {}).get("detalle", [])
    }

    calidad_estructural = evaluar_calidad_estructural(documentos, codigos_duplicados)
    calidad_documental = evaluar_calidad_documental(documentos)
    calidad_relacional = evaluar_calidad_relacional(documentos, reporte_validacion)
    madurez = evaluar_madurez_documental(documentos, codigos_duplicados)
    hallazgos_funcionales = ejecutar_auditoria_funcional(documentos, reporte_validacion)
    matriz_riesgo = construir_matriz_riesgo(hallazgos_funcionales)
    recomendaciones = construir_recomendaciones(hallazgos_funcionales)

    fecha_generacion = datetime.datetime.now(datetime.timezone.utc).isoformat()

    auditoria = {
        "metadata": {
            "fechaGeneracion": fecha_generacion,
            "versionAuditor": VERSION_AUDITOR,
            "archivoJsonPmo": os.path.basename(ruta_json_pmo),
            "archivoReporteValidacion": os.path.basename(ruta_reporte_validacion),
            "totalDocumentos": len(documentos),
        },
        "calidadEstructural": calidad_estructural,
        "calidadDocumental": calidad_documental,
        "calidadRelacional": calidad_relacional,
        "madurezDocumental": madurez,
        "hallazgosFuncionales": hallazgos_funcionales,
        "matrizRiesgo": matriz_riesgo,
        "recomendaciones": recomendaciones,
    }

    ruta_json = os.path.join(carpeta_salida, "auditoria-funcional.json")
    with open(ruta_json, "w", encoding="utf-8") as f:
        json.dump(auditoria, f, ensure_ascii=False, indent=2)

    markdown = generar_markdown(auditoria, fecha_generacion)
    ruta_md = os.path.join(carpeta_salida, "auditoria-funcional.md")
    with open(ruta_md, "w", encoding="utf-8") as f:
        f.write(markdown)

    # ---------------- RESUMEN POR CONSOLA ----------------
    print("=" * 70)
    print("AUDITORIA FUNCIONAL PMO COMPLETADA")
    print("=" * 70)
    print(f"Documentos analizados: {len(documentos)}")
    print()
    print(f"Calidad estructural : {calidad_estructural['porcentaje']}% ({calidad_estructural['clasificacion']})")
    print(f"Calidad documental   : {calidad_documental['porcentaje']}% ({calidad_documental['clasificacion']})")
    print(f"Calidad relacional   : {calidad_relacional['porcentaje']}% ({calidad_relacional['clasificacion']})")
    print(f"Madurez promedio     : {madurez['nivelPromedio']} / 5")
    print(f"Listos para auditoria: {madurez['porcentajeListosParaAuditoria']}%")
    print()
    print(f"Hallazgos funcionales: {len(hallazgos_funcionales)}")
    for s in SEVERIDADES:
        print(f"  {s}: {matriz_riesgo['resumen'][s]}")
    print()
    print("Roadmap (top 5):")
    for r in recomendaciones[:5]:
        print(f"  Prioridad {r['prioridad']}: {r['accion']} (severidad maxima {r['severidadMaxima']})")
    print()
    print("Archivos generados:")
    print(f"  {ruta_json}")
    print(f"  {ruta_md}")


if __name__ == "__main__":
    main()
