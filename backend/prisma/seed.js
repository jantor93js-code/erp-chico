"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    const docTypes = await Promise.all([
        prisma.documentTypeRef.create({
            data: {
                nombre: 'Factura',
                codigo: 'FACTURA',
                descripcion: 'Documento de facturación',
                activo: true,
            },
        }),
        prisma.documentTypeRef.create({
            data: {
                nombre: 'Cotización',
                codigo: 'COTIZACION',
                descripcion: 'Documento de cotización',
                activo: true,
            },
        }),
        prisma.documentTypeRef.create({
            data: {
                nombre: 'Pedido',
                codigo: 'PEDIDO',
                descripcion: 'Documento de pedido',
                activo: true,
            },
        }),
        prisma.documentTypeRef.create({
            data: {
                nombre: 'Remisión',
                codigo: 'REMISION',
                descripcion: 'Documento de remisión',
                activo: true,
            },
        }),
        prisma.documentTypeRef.create({
            data: {
                nombre: 'Nota de Crédito',
                codigo: 'NOTA_CREDITO',
                descripcion: 'Nota de crédito',
                activo: true,
            },
        }),
    ]);
    console.log('✅ Document types created:', docTypes.length);
    const docStatuses = await Promise.all([
        prisma.documentStatusRef.create({
            data: {
                nombre: 'Borrador',
                codigo: 'BORRADOR',
                descripcion: 'Documento en estado de borrador',
                color: '#E5E7EB',
                activo: true,
            },
        }),
        prisma.documentStatusRef.create({
            data: {
                nombre: 'Enviado',
                codigo: 'ENVIADO',
                descripcion: 'Documento enviado',
                color: '#BFDBFE',
                activo: true,
            },
        }),
        prisma.documentStatusRef.create({
            data: {
                nombre: 'Aprobado',
                codigo: 'APROBADO',
                descripcion: 'Documento aprobado',
                color: '#DCFCE7',
                activo: true,
            },
        }),
        prisma.documentStatusRef.create({
            data: {
                nombre: 'Archivado',
                codigo: 'ARCHIVADO',
                descripcion: 'Documento archivado',
                color: '#F3F4F6',
                activo: true,
            },
        }),
        prisma.documentStatusRef.create({
            data: {
                nombre: 'Rechazado',
                codigo: 'RECHAZADO',
                descripcion: 'Documento rechazado',
                color: '#FEE2E2',
                activo: true,
            },
        }),
    ]);
    console.log('✅ Document statuses created:', docStatuses.length);
    const taskStatuses = await Promise.all([
        prisma.taskStatusRef.create({
            data: {
                nombre: 'Pendiente',
                codigo: 'PENDIENTE',
                descripcion: 'Tarea pendiente',
                activo: true,
            },
        }),
        prisma.taskStatusRef.create({
            data: {
                nombre: 'En Progreso',
                codigo: 'EN_PROGRESO',
                descripcion: 'Tarea en progreso',
                activo: true,
            },
        }),
        prisma.taskStatusRef.create({
            data: {
                nombre: 'Completada',
                codigo: 'COMPLETADA',
                descripcion: 'Tarea completada',
                activo: true,
            },
        }),
        prisma.taskStatusRef.create({
            data: {
                nombre: 'En Espera',
                codigo: 'EN_ESPERA',
                descripcion: 'Tarea en espera',
                activo: true,
            },
        }),
        prisma.taskStatusRef.create({
            data: {
                nombre: 'Cancelada',
                codigo: 'CANCELADA',
                descripcion: 'Tarea cancelada',
                activo: true,
            },
        }),
    ]);
    console.log('✅ Task statuses created:', taskStatuses.length);
    const areas = await Promise.all([
        prisma.area.create({
            data: {
                nombre: 'Operaciones',
                codigo: 'OPS',
                descripcion: 'Área de Operaciones y Logística',
                estado: 'ACTIVO',
            },
        }),
        prisma.area.create({
            data: {
                nombre: 'Administración',
                codigo: 'ADM',
                descripcion: 'Área de Administración',
                estado: 'ACTIVO',
            },
        }),
        prisma.area.create({
            data: {
                nombre: 'Finanzas',
                codigo: 'FIN',
                descripcion: 'Área de Finanzas',
                estado: 'ACTIVO',
            },
        }),
        prisma.area.create({
            data: {
                nombre: 'Recursos Humanos',
                codigo: 'RRHH',
                descripcion: 'Área de Recursos Humanos',
                estado: 'ACTIVO',
            },
        }),
    ]);
    console.log('✅ Areas created:', areas.length);
    const processes = await Promise.all([
        prisma.process.create({
            data: {
                nombre: 'Gestión de Pedidos',
                codigo: 'PROC_PEDIDOS',
                descripcion: 'Proceso de gestión de pedidos',
                areaId: areas[0].id,
                estado: 'ACTIVO',
            },
        }),
        prisma.process.create({
            data: {
                nombre: 'Planificación de Rutas',
                codigo: 'PROC_RUTAS',
                descripcion: 'Proceso de planificación de rutas de distribución',
                areaId: areas[0].id,
                estado: 'ACTIVO',
            },
        }),
        prisma.process.create({
            data: {
                nombre: 'Control de Inventario',
                codigo: 'PROC_INVENTARIO',
                descripcion: 'Proceso de control de inventario',
                areaId: areas[0].id,
                estado: 'ACTIVO',
            },
        }),
        prisma.process.create({
            data: {
                nombre: 'Facturación',
                codigo: 'PROC_FACTURACION',
                descripcion: 'Proceso de facturación',
                areaId: areas[1].id,
                estado: 'ACTIVO',
            },
        }),
        prisma.process.create({
            data: {
                nombre: 'Conciliación Contable',
                codigo: 'PROC_CONCILIACION',
                descripcion: 'Proceso de conciliación contable',
                areaId: areas[2].id,
                estado: 'ACTIVO',
            },
        }),
        prisma.process.create({
            data: {
                nombre: 'Nómina',
                codigo: 'PROC_NOMINA',
                descripcion: 'Proceso de nómina',
                areaId: areas[3].id,
                estado: 'ACTIVO',
            },
        }),
    ]);
    console.log('✅ Processes created:', processes.length);
    console.log('🎉 Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map