import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getGraficas(): Promise<{
        facturacionMensual: {
            mes: string;
            valor: number;
        }[];
        pagosMensuales: {
            mes: string;
            valor: number;
        }[];
        gastosMensuales: {
            mes: string;
            valor: number;
        }[];
        utilidadMensual: {
            mes: string;
            valor: number;
        }[];
    }>;
    getResumen(): Promise<{
        clientes: number;
        pedidos: number;
        servicios: number;
        serviciosProgramados: number;
        serviciosEnRuta: number;
        serviciosEntregados: number;
        conductores: number;
        facturas: number;
        facturasPendientes: number;
        facturasPagadas: number;
        pagosRegistrados: number;
        totalPagado: number;
        saldoPorCobrar: number;
        totalFacturado: number;
        totalGastosOperativos: number;
        utilidadOperativa: number;
        rentabilidadPromedio: number;
        facturadoMes: number;
        pagosMes: number;
        gastosMes: number;
        utilidadMes: number;
        pedidosMes: number;
        serviciosMes: number;
    }>;
}
