#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NORMALIZADOR JSON -> MODELO DOCUMENTAL RELACIONAL PMO (v2)

Lee documentos-biblioteca.json (salida del Transformador) y produce:
    1) json-pmo.json                  -> modelo documental relacional del PMO
    2) advertencias-normalizacion.json -> advertencias de nivel documento y catalogo

Modelo de salida (json-pmo.json):
    - metadata (raiz): informacion de EJECUCION del pipeline (fechas, versiones,
      archivo de origen, total de documentos). Aparece una unica vez.
    - catalogos: tiposDocumentales, areas, codigosArea, procesos, estados,
      responsablesActualizacion, responsablesRevision. Cada entrada tiene
      valorOriginal / clave / conteo (mas los campos adicionales de
      "procesos", ver mas abajo).
    - documentos: lista de 300 documentos. Cada documento tiene:
        * campos directos (se copian tal cual del Transformador).
        * campos relacionales (patron valor / valorClave / valorId):
          tipoDocumental, area, codigoArea, proceso, estado,
          responsableActualizacion, responsableRevision.
        * esDefinicionDeProceso (booleano, a nivel raiz del documento).
        * metadata (por documento): unicamente origenHoja y filaExcel.
          NO contiene fechas ni versiones (esas viven solo en la metadata raiz).
        * NO existe ningun bloque "origen" con el registro completo.

Catalogo "procesos" (conciliado con documentos tipo PROCESO):
    Cada entrada tiene, ademas de valorOriginal/clave/conteo:
        - definidoComoDocumento (bool): si algun documento tipo PROCESO
          define ese proceso formalmente (por su campo "nombre").
        - codigoDocumentoDefinicion (str o None): codigoDocumento de ese
          documento tipo PROCESO, o None si no esta definido como documento.
    Pueden existir entradas con conteo == 0: son procesos definidos
    formalmente (documento tipo PROCESO) que ningun otro documento
    referencia mediante su campo "proceso". Esto es comportamiento esperado,
    no se filtran ni se ocultan.

Esta reconciliacion es de solo lectura/anotacion: no se modifica el campo
"proceso" de ningun documento, no se inventan valores.

Uso:
    python3 normalizador.py <ruta_documentos_biblioteca_json> [carpeta_salida]

Si no se indican argumentos, usa los valores por defecto definidos abajo.

Este script es independiente de transformador.py: no lo importa ni ejecuta
su codigo. Solo consume el archivo JSON que este ultimo produce.
"""

import sys
import os
import re
import json
import unicodedata
import datetime

# =====================================================================
# CONFIGURACION POR DEFECTO
# =====================================================================

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

DEFAULT_INPUT = BASE_DIR / "documentos-biblioteca.json"
DEFAULT_OUTPUT_DIR = BASE_DIR

# Version del propio Normalizador.
VERSION_NORMALIZADOR = "normalizador-1.0.0"

# Version del Transformador con la que este Normalizador es compatible.
# Esta constante debe actualizarse manualmente cada vez que cambie
# VERSION_TRANSFORMADOR en transformador.py. No se sincroniza automaticamente.
VERSION_TRANSFORMADOR_COMPATIBLE = "transformador-1.0.0"

# Campos que se copian tal cual desde documentos-biblioteca.json, sin
# convertirse en entidades relacionales.
CAMPOS_DIRECTOS = [
    "codigoDocumento",
    "nombre",
    "version",
    "vigencia",
    "fechaCreacion",
    "fechaRevision",
    "fechaProximaRevision",
    "observaciones",
]

# Campos que se promueven a entidad relacional (patron valor/valorClave/valorId).
# Tupla: (campo_origen_en_documentos_biblioteca, campo_salida_en_json_pmo).
CAMPOS_RELACIONALES = [
    ("tipoDocumental", "tipoDocumental"),
    ("area", "area"),
    ("codigoArea", "codigoArea"),
    ("proceso", "proceso"),
    ("estado", "estado"),
    ("responsableActualizacion", "responsableActualizacion"),
    ("responsableRevision", "responsableRevision"),
]

# Mapeo de campo_origen -> categoria de catalogo. Los responsables se
# separan por rol: no existe un catalogo combinado "responsables".
CATEGORIA_CATALOGO = {
    "tipoDocumental": "tiposDocumentales",
    "area": "areas",
    "codigoArea": "codigosArea",
    "proceso": "procesos",
    "estado": "estados",
    "responsableActualizacion": "responsablesActualizacion",
    "responsableRevision": "responsablesRevision",
}


# =====================================================================
# UTILIDADES
# =====================================================================

def slugify(valor):
    """
    Convierte un valor a su forma canonica ("clave"): minusculas, sin
    tildes, sin caracteres especiales, palabras separadas por guiones.
    None-safe: None -> None.
    """
    if valor is None:
        return None
    texto = str(valor).strip().lower()
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    texto = re.sub(r"[^a-z0-9]+", "-", texto)
    texto = texto.strip("-")
    return texto if texto != "" else None


def obtener_id_relacional(ids_por_categoria, categoria, clave):
    """
    Asigna un identificador secuencial y estable a cada clave dentro de
    una categoria, en orden de primera aparicion. None-safe: clave None
    devuelve id None (no se registra en el mapa de ids).
    """
    if clave is None:
        return None
    mapa = ids_por_categoria.setdefault(categoria, {})
    if clave not in mapa:
        mapa[clave] = str(len(mapa) + 1)
    return mapa[clave]


def registrar_catalogo(catalogos_raw, categoria, valor_original, clave):
    """
    Registra (o incrementa el conteo de) una entrada de catalogo.
    Ignora valores None (no se crea entrada para campos vacios).
    """
    if valor_original is None or clave is None:
        return
    entradas = catalogos_raw.setdefault(categoria, {})
    entrada = entradas.get(clave)
    if entrada is None:
        entradas[clave] = {"valorOriginal": valor_original, "clave": clave, "conteo": 1}
    else:
        entrada["conteo"] += 1


def finalizar_catalogos(catalogos_raw):
    """
    Convierte cada categoria (dict clave -> entrada) en una lista ordenada
    por conteo descendente (empate: orden alfabetico de clave).
    """
    catalogos = {}
    for categoria, entradas in catalogos_raw.items():
        lista = list(entradas.values())
        lista.sort(key=lambda e: (-e["conteo"], e["clave"] or ""))
        catalogos[categoria] = lista
    return catalogos


def calcular_fecha_transformacion(ruta_entrada):
    """
    Aproxima la fecha en que se genero el archivo de entrada usando su
    fecha de modificacion en disco.
    """
    timestamp = os.path.getmtime(ruta_entrada)
    return datetime.datetime.fromtimestamp(timestamp).isoformat()


# =====================================================================
# ADVERTENCIAS DE NIVEL DOCUMENTO
# =====================================================================

def generar_advertencias_documento(doc_origen, advertencias):
    """
    Advertencias de nivel "documento" ya existentes, evaluadas sobre el
    registro crudo de documentos-biblioteca.json (no se inventan campos
    nuevos de advertencia en este sprint).
    """
    codigo = doc_origen.get("codigoDocumento")

    if doc_origen.get("proceso") is None:
        advertencias.append({
            "nivel": "documento",
            "campo": "proceso",
            "tipo": "Proceso sin informacion",
            "detalle": f"Documento '{codigo}' no tiene proceso asociado",
        })

    if doc_origen.get("nombre") is None:
        advertencias.append({
            "nivel": "documento",
            "campo": "nombre",
            "tipo": "Nombre de documento vacio",
            "detalle": f"Documento '{codigo}' no tiene nombre",
        })


# =====================================================================
# RECONCILIACION DE PROCESOS (definidos vs referenciados)
# =====================================================================

def calcular_procesos_definidos(documentos_excel, advertencias):
    """
    Calcula el conjunto de procesos "definidos": uno por cada clave de
    nombre de documento tipo PROCESO con nombre no nulo. Si existe mas de
    un documento tipo PROCESO con la misma clave, se conserva el primero
    en orden de aparicion y se registra la advertencia correspondiente
    (caso borde CB-3).
    """
    definidos = {}
    for doc in documentos_excel:
        if doc.get("tipoDocumental") != "PROCESO":
            continue
        nombre = doc.get("nombre")
        if nombre is None:
            continue
        clave = slugify(nombre)
        codigo = doc.get("codigoDocumento")
        if clave not in definidos:
            definidos[clave] = {"nombre": nombre, "codigoDocumento": codigo, "todos": [codigo]}
        else:
            definidos[clave]["todos"].append(codigo)

    for clave, info in definidos.items():
        if len(info["todos"]) > 1:
            advertencias.append({
                "nivel": "catalogo",
                "campo": "proceso",
                "tipo": "Proceso definido mas de una vez",
                "detalle": (
                    f"'{info['nombre']}' definido por mas de un documento: "
                    f"{', '.join(str(c) for c in info['todos'])}"
                ),
            })

    return definidos


def reconciliar_procesos(catalogos, documentos_excel, advertencias):
    """
    Implementa el cambio 3.2, Parte B: enriquece catalogos["procesos"]
    (procesos referenciados) con la informacion de procesos definidos
    formalmente por documentos tipo PROCESO, y agrega entradas nuevas con
    conteo 0 para los procesos definidos que nadie referencia.
    """
    procesos_catalogo = catalogos.get("procesos", [])
    claves_referenciadas = {entrada["clave"] for entrada in procesos_catalogo}

    definidos = calcular_procesos_definidos(documentos_excel, advertencias)

    for entrada in procesos_catalogo:
        clave = entrada["clave"]
        if clave in definidos:
            entrada["definidoComoDocumento"] = True
            entrada["codigoDocumentoDefinicion"] = definidos[clave]["codigoDocumento"]
        else:
            entrada["definidoComoDocumento"] = False
            entrada["codigoDocumentoDefinicion"] = None

    nuevas_entradas = []
    for clave, info in definidos.items():
        if clave in claves_referenciadas:
            continue
        nuevas_entradas.append({
            "valorOriginal": info["nombre"],
            "clave": clave,
            "conteo": 0,
            "definidoComoDocumento": True,
            "codigoDocumentoDefinicion": info["codigoDocumento"],
        })
        advertencias.append({
            "nivel": "catalogo",
            "campo": "proceso",
            "tipo": "Proceso definido sin documentos que lo referencien",
            "detalle": (
                f"'{info['nombre']}' (documento {info['codigoDocumento']}) "
                f"no es referenciado como 'proceso' por ningun otro documento"
            ),
        })

    procesos_catalogo.extend(nuevas_entradas)
    procesos_catalogo.sort(key=lambda e: (-e["conteo"], e["clave"] or ""))
    catalogos["procesos"] = procesos_catalogo


# =====================================================================
# CONSTRUCCION DE UN DOCUMENTO NORMALIZADO
# =====================================================================

def construir_documento(doc_origen, catalogos_raw, ids_por_categoria):
    """
    Construye el registro normalizado de un documento: campos directos,
    campos relacionales (valor/valorClave/valorId), esDefinicionDeProceso
    y metadata por documento (unicamente origenHoja y filaExcel).
    """
    registro = {}

    for campo in CAMPOS_DIRECTOS:
        registro[campo] = doc_origen.get(campo)

    for campo_origen, campo_salida in CAMPOS_RELACIONALES:
        valor = doc_origen.get(campo_origen)
        clave = slugify(valor)
        categoria = CATEGORIA_CATALOGO[campo_origen]

        if valor is not None:
            registrar_catalogo(catalogos_raw, categoria, valor, clave)
            id_valor = obtener_id_relacional(ids_por_categoria, categoria, clave)
        else:
            id_valor = None

        registro[campo_salida] = valor
        registro[f"{campo_salida}Clave"] = clave
        registro[f"{campo_salida}Id"] = id_valor

    registro["esDefinicionDeProceso"] = doc_origen.get("tipoDocumental") == "PROCESO"

    registro["metadata"] = {
        "origenHoja": doc_origen.get("origenHoja"),
        "filaExcel": None,
    }

    return registro


# =====================================================================
# NORMALIZACION PRINCIPAL
# =====================================================================

def normalizar(documentos_excel, fecha_transformacion, archivo_origen):
    """
    Construye el modelo documental relacional completo (json-pmo.json) y
    la lista de advertencias (advertencias-normalizacion.json) a partir
    de los documentos crudos del Transformador.
    """
    catalogos_raw = {}
    ids_por_categoria = {}
    advertencias = []
    documentos_salida = []

    for doc_origen in documentos_excel:
        registro = construir_documento(doc_origen, catalogos_raw, ids_por_categoria)
        documentos_salida.append(registro)
        generar_advertencias_documento(doc_origen, advertencias)

    catalogos = finalizar_catalogos(catalogos_raw)
    reconciliar_procesos(catalogos, documentos_excel, advertencias)

    metadata_raiz = {
        "fechaGeneracion": datetime.datetime.now().isoformat(),
        "fechaTransformacion": fecha_transformacion,
        "versionNormalizador": VERSION_NORMALIZADOR,
        "versionTransformador": VERSION_TRANSFORMADOR_COMPATIBLE,
        "archivoOrigen": archivo_origen,
        "totalDocumentos": len(documentos_salida),
    }

    salida_pmo = {
        "metadata": metadata_raiz,
        "catalogos": catalogos,
        "documentos": documentos_salida,
    }

    return salida_pmo, advertencias


# =====================================================================
# MAIN
# =====================================================================

def main():
    ruta_entrada = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_INPUT
    carpeta_salida = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUTPUT_DIR

    if not os.path.isfile(ruta_entrada):
        print(f"ERROR: no se encontro el archivo de entrada: {ruta_entrada}")
        sys.exit(1)

    os.makedirs(carpeta_salida, exist_ok=True)

    with open(ruta_entrada, "r", encoding="utf-8") as f:
        documentos_excel = json.load(f)

    fecha_transformacion = calcular_fecha_transformacion(ruta_entrada)
    archivo_origen = os.path.basename(ruta_entrada)

    salida_pmo, advertencias = normalizar(documentos_excel, fecha_transformacion, archivo_origen)

    ruta_json_pmo = os.path.join(carpeta_salida, "json-pmo.json")
    ruta_advertencias = os.path.join(carpeta_salida, "advertencias-normalizacion.json")

    with open(ruta_json_pmo, "w", encoding="utf-8") as f:
        json.dump(salida_pmo, f, ensure_ascii=False, indent=2)

    with open(ruta_advertencias, "w", encoding="utf-8") as f:
        json.dump(advertencias, f, ensure_ascii=False, indent=2)

    print("=" * 70)
    print("NORMALIZACION COMPLETADA")
    print("=" * 70)
    print(f"Archivo de origen: {ruta_entrada}")
    print(f"Documentos normalizados: {len(salida_pmo['documentos'])}")
    print(f"Advertencias generadas: {len(advertencias)}")

    print("\nCatalogos generados:")
    for categoria, entradas in salida_pmo["catalogos"].items():
        print(f"  {categoria}: {len(entradas)} entradas")

    por_tipo = {}
    for a in advertencias:
        por_tipo[a["tipo"]] = por_tipo.get(a["tipo"], 0) + 1
    print("\nAdvertencias por tipo:")
    for tipo, cantidad in sorted(por_tipo.items(), key=lambda x: -x[1]):
        print(f"  {tipo}: {cantidad}")

    print("\nArchivos generados:")
    print(f"  {ruta_json_pmo}")
    print(f"  {ruta_advertencias}")


if __name__ == "__main__":
    main()
