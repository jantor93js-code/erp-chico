import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
export declare class PagosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePagoDto): Promise<{
        id: string;
        valor: number;
        metodoPago: string;
        fechaPago: Date;
        createdAt: Date;
        updatedAt: Date;
        facturaId: string;
    }>;
    findAll(): Promise<({
        factura: {
            id: string;
            valor: number;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            pedidoId: string;
            numeroFactura: string;
            estadoPago: string;
            fechaEmision: Date;
            fechaVencimiento: Date;
        };
    } & {
        id: string;
        valor: number;
        metodoPago: string;
        fechaPago: Date;
        createdAt: Date;
        updatedAt: Date;
        facturaId: string;
    })[]>;
}
