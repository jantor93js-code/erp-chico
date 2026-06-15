import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getResumen(): Promise<{
        clientes: number;
        pedidos: number;
        servicios: number;
        conductores: number;
        facturas: number;
        totalPagado: number;
    }>;
}
