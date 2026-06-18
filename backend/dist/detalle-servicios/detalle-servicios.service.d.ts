import { PrismaService } from '../prisma/prisma.service';
import { CreateDetalleServicioDto } from './dto/create-detalle-servicio.dto';
export declare class DetalleServiciosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateDetalleServicioDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        pedidoId: string;
        cantidad: number;
        valorUnitario: number;
        valorTotal: number;
    }>;
    findAll(): Promise<({
        pedido: {
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        pedidoId: string;
        cantidad: number;
        valorUnitario: number;
        valorTotal: number;
    })[]>;
    findByPedido(pedidoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        pedidoId: string;
        cantidad: number;
        valorUnitario: number;
        valorTotal: number;
    }[]>;
}
