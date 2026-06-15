# Diseño de Base de Datos - ERP CHICO (MVP)

Este documento define la estructura técnica de la base de datos PostgreSQL. Todas las tablas incluyen soporte para multiempresa (`tenant_id`) y trazabilidad de auditoría.

## 1. Estándares Globales

*   **PKs:** Todos los identificadores primarios son de tipo `UUID`.
*   **Multiempresa:** Todas las tablas (excepto `tenants`) incluyen `tenant_id UUID NOT NULL`.
*   **Auditoría:** Todas las tablas incluyen:
    *   `created_at` (timestamp with time zone)
    *   `updated_at` (timestamp with time zone)
    *   `created_by` (UUID, FK a users)
    *   `updated_by` (UUID, FK a users)
*   **Moneda:** Todos los valores monetarios usan `DECIMAL(15,2)`.

---

## 2. Diccionario de Tablas

### 2.1 Módulo: Núcleo y Seguridad

| Tabla | Descripción | Campos Clave |
| :--- | :--- | :--- |
| **tenants** | Empresas suscritas al ERP | id, nombre, nit, activo |
| **roles** | Perfiles de acceso | id, nombre, slug, permisos (JSONB) |
| **users** | Usuarios del sistema | id (FK Supabase), email, role_id, tenant_id |

### 2.2 Módulo: Comercial

| Tabla | Campos Principales | FKs / Relaciones |
| :--- | :--- | :--- |
| **clientes** | nit, razon_social, tipo_persona, direccion, email_facturacion | tenant_id |
| **contactos** | nombre, cargo, telefono, email | cliente_id |
| **cotizaciones** | numero_cotizacion, fecha, validez, subtotal, iva, total, estado | cliente_id, contacto_id |
| **pedidos** | numero_pedido, fecha_solicitud, origen_ciudad, destino_ciudad, estado | cotizacion_id, cliente_id |

### 2.3 Módulo: Operaciones y Recursos

| Tabla | Campos Principales | FKs / Relaciones |
| :--- | :--- | :--- |
| **vehiculos** | placa, modelo, marca, tipo_vehiculo (propio/tercero), capacidad_kg | tenant_id |
| **conductores** | cedula, nombre, telefono, licencia_categoria, tipo_vinculacion | user_id (opcional), tenant_id |
| **operarios** | cedula, nombre, cargo (auxiliar/operario) | tenant_id |
| **proveedores_op** | nit, razon_social, tipo_servicio (transporte/bodega) | tenant_id |
| **servicios_op** | fecha_servicio, hora_inicio, descripcion, estado | pedido_id, vehiculo_id, conductor_id |
| **asignacion_recursos** | Relación muchos a muchos de personal en un servicio | servicio_id, operario_id |
| **novedades** | fecha_hora, descripcion, tipo_novedad, criticidad | servicio_id, created_by |

### 2.4 Módulo: Legalizaciones y Finanzas

| Tabla | Campos Principales | FKs / Relaciones |
| :--- | :--- | :--- |
| **anticipos** | fecha, valor, metodo_pago, estado | servicio_id, conductor_id |
| **legalizaciones** | fecha_cierre, total_gastos, estado_aprobacion | servicio_id |
| **gastos** | fecha_gasto, valor, concepto, observacion | legalizacion_id, proveedor_id (opcional) |
| **soportes** | url_archivo, tipo_documento (remesa/factura/foto) | gasto_id, servicio_id |
| **facturas** | numero_factura, fecha_emision, fecha_vencimiento, total, saldo, estado | cliente_id, tenant_id |
| **factura_items** | descripcion, cantidad, valor_unitario, subtotal | factura_id, servicio_id |
| **pagos** | fecha_pago, valor, referencia_transaccion | factura_id, tenant_id |

---

## 3. Tipos y Dominios (PostgreSQL)

Se definen los siguientes Enums para control de integridad:

*   `estado_pedido`: ['BORRADOR', 'APROBADO', 'EN_EJECUCION', 'FINALIZADO', 'ANULADO']
*   `estado_servicio`: ['PROGRAMADO', 'DESPACHADO', 'EN_RUTA', 'ENTREGADO', 'LEGALIZADO', 'CERRADO']
*   `estado_legalizacion`: ['PENDIENTE', 'REVISION', 'APROBADA', 'RECHAZADA']
*   `estado_factura`: ['PENDIENTE', 'FACTURADO', 'PAGADO_PARCIAL', 'PAGADO_TOTAL', 'ANULADO']

---

## 4. Índices y Restricciones

### Índices (Performance)
*   **Unique Index:** `tenants(nit)`
*   **Unique Index:** `clientes(tenant_id, nit)`
*   **Index:** `servicios_op(tenant_id, estado)`
*   **Index:** `facturas(tenant_id, cliente_id)`
*   **Composite Index:** `pedidos(tenant_id, fecha_solicitud)`

### Restricciones (Integridad)
*   **Check:** `gastos.valor > 0`
*   **Check:** `vehiculos.capacidad_kg >= 0`
*   **FK Delete Restrict:** No se puede borrar un cliente si tiene pedidos asociados.
*   **FK Delete Cascade:** Si se borra una legalización, se borran sus gastos asociados.

---

## 5. Esquema de Auditoría Automática

Se implementará mediante Triggers:
1.  **Timestamp:** El campo `updated_at` se actualizará automáticamente en cada `UPDATE`.
2.  **Trazabilidad:** Inserción en una tabla `audit_logs` que capture: `table_name`, `record_id`, `action` (I/U/D), `old_data` (JSONB), `new_data` (JSONB), `user_id`.

---

## 6. Configuración Multiempresa (RLS)

Dado que se utilizará Supabase/PostgreSQL, se aplicará **Row Level Security (RLS)** en todas las tablas:
```sql
CREATE POLICY tenant_isolation_policy ON table_name
    USING (tenant_id = auth.jwt() ->> 'tenant_id');
```
*Nota: El tenant_id se inyectará en el JWT del usuario tras el login.*
```

<!--
[PROMPT_SUGGESTION]Genera el script SQL de creación de tablas (DDL) basado en el documento BASE_DATOS_MVP.md.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Define los Triggers de PostgreSQL para la gestión automática de auditoría y actualización de timestamps.[/PROMPT_SUGGESTION]
-->