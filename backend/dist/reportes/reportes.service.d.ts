import { PrismaService } from '../prisma/prisma.service';
export declare class ReportesService {
    private prisma;
    constructor(prisma: PrismaService);
    financiero(): Promise<{
        ingresos: number;
        gastos: number;
        utilidad: number;
        rentabilidad: number;
    }>;
    conductoresTop(): Promise<{
        conductorId: string;
        nombre: string;
        servicios: number;
    }[]>;
    clientesTop(): Promise<{
        cliente: string;
        facturacion: unknown;
    }[]>;
}
