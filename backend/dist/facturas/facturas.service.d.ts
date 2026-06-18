import { PrismaService } from '../prisma/prisma.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
export declare class FacturasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFacturaDto): Promise<{
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
    }>;
    findAll(): Promise<{
        totalPagado: number;
        saldoPendiente: number;
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
            cotizacion: {
                tenantId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                clienteId: string;
                ejecutivoId: string;
                descripcion: string | null;
                tipoServicio: string | null;
                origen: string;
                destino: string;
                estado: string;
                numeroCotizacion: string;
                valorCotizado: number;
                fechaCreacion: Date;
            } | null;
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
        pagos: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            valor: number;
            facturaId: string;
            metodoPago: string;
            fechaPago: Date;
        }[];
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
    }[]>;
}
