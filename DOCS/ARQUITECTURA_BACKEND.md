\# Arquitectura Backend - ERP CHICO



\## Stack



\- NestJS

\- PostgreSQL

\- Prisma ORM

\- Supabase Auth

\- Docker



\## Estructura de módulos



src/



├── auth/

├── users/

├── roles/

├── tenants/



├── clientes/

├── contactos/

├── cotizaciones/

├── pedidos/



├── vehiculos/

├── conductores/

├── operarios/

├── proveedores/



├── servicios/

├── asignaciones/

├── novedades/



├── anticipos/

├── legalizaciones/

├── gastos/

├── soportes/



├── facturas/

├── pagos/



├── dashboard/



├── common/

├── database/

├── config/



└── main.ts



\## Orden de construcción



Fase 1:

\- Auth

\- Tenants

\- Roles

\- Users



Fase 2:

\- Clientes

\- Contactos



Fase 3:

\- Cotizaciones

\- Pedidos



Fase 4:

\- Vehículos

\- Conductores

\- Operarios

\- Proveedores



Fase 5:

\- Servicios

\- Asignaciones

\- Novedades



Fase 6:

\- Anticipos

\- Legalizaciones

\- Gastos

\- Soportes



Fase 7:

\- Facturas

\- Pagos



Fase 8:

\- Dashboard

