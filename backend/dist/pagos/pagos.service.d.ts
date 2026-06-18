import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
export declare class PagosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePagoDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        valor: number;
        facturaId: string;
        metodoPago: string;
        fechaPago: Date;
    }>;
    findAll(): Promise<({
        factura: {
            pedido: {
                cliente: {
                    tenantId: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    identificacion: string;
                    razonSocial: string;
                    tipoCliente: string | null;
                    contactoPrincipal: string | null;
                };
            } & {
                tenantId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                clienteId: string;
                ejecutivoId: string;
                descripcion: string | null;
                valorTotalPactado: number | null;
                fechaSolicitud: Date;
                tipoServicio: string | null;
                numeroPedido: string | null;
                origen: string | null;
                destino: string | null;
                origenPedido: string | null;
                cotizacionId: string | null;
                fechaProgramada: Date | null;
                vehiculoId: string | null;
                conductorId: string | null;
                lineaNegocio: string;
                estado: string;
            };
        } & {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            pedidoId: string;
            valor: number;
            numeroFactura: string;
            estadoPago: string;
            fechaEmision: Date;
            fechaVencimiento: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        valor: number;
        facturaId: string;
        metodoPago: string;
        fechaPago: Date;
    })[]>;
    findByFactura(facturaId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        valor: number;
        facturaId: string;
        metodoPago: string;
        fechaPago: Date;
    }[]>;
}
