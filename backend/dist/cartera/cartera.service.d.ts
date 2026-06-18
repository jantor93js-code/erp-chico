import { PrismaService } from '../prisma/prisma.service';
export declare class CarteraService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        facturaId: string;
        numeroFactura: string;
        cliente: string;
        valorFactura: number;
        totalPagado: number;
        saldoPendiente: number;
        estadoPago: string;
        fechaVencimiento: Date;
    }[]>;
    findPendientes(): Promise<{
        facturaId: string;
        numeroFactura: string;
        cliente: string;
        valorFactura: number;
        totalPagado: number;
        saldoPendiente: number;
        estadoPago: string;
        fechaVencimiento: Date;
        diasVencidos: number;
    }[]>;
}
