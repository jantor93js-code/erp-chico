import { PrismaService } from '../prisma/prisma.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
export declare class EvidenciasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateEvidenciaDto): Promise<{
        id: string;
        nombreArchivo: string | null;
        mimeType: string | null;
        tamanoArchivo: number | null;
        tipo: string;
        urlArchivo: string | null;
        observacion: string | null;
        createdAt: Date;
        updatedAt: Date;
        servicioId: string;
        pedidoId: string | null;
    }>;
    findAll(): Promise<({
        servicio: {
            pedido: {
                cliente: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tenantId: string;
                    identificacion: string;
                    razonSocial: string;
                    tipoCliente: string | null;
                    contactoPrincipal: string | null;
                };
                cotizacion: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tenantId: string;
                    tipoServicio: string | null;
                    origen: string;
                    destino: string;
                    estado: string;
                    clienteId: string;
                    ejecutivoId: string;
                    descripcion: string | null;
                    numeroCotizacion: string;
                    valorCotizado: number;
                    fechaCreacion: Date;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                vehiculoId: string | null;
                conductorId: string | null;
                tipoServicio: string | null;
                origen: string | null;
                destino: string | null;
                fechaProgramada: Date | null;
                estado: string;
                clienteId: string;
                ejecutivoId: string;
                fechaSolicitud: Date;
                descripcion: string | null;
                numeroPedido: string | null;
                valorTotalPactado: number | null;
                origenPedido: string | null;
                cotizacionId: string | null;
                lineaNegocio: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            pedidoId: string;
            tenantId: string;
            vehiculoId: string | null;
            conductorId: string | null;
            tipoServicio: string;
            origen: string | null;
            destino: string | null;
            fechaProgramada: Date | null;
            fechaInicio: Date | null;
            fechaFin: Date | null;
            estado: string;
        };
    } & {
        id: string;
        nombreArchivo: string | null;
        mimeType: string | null;
        tamanoArchivo: number | null;
        tipo: string;
        urlArchivo: string | null;
        observacion: string | null;
        createdAt: Date;
        updatedAt: Date;
        servicioId: string;
        pedidoId: string | null;
    })[]>;
    findByPedido(pedidoId: string): Promise<{
        id: string;
        nombreArchivo: string | null;
        mimeType: string | null;
        tamanoArchivo: number | null;
        tipo: string;
        urlArchivo: string | null;
        observacion: string | null;
        createdAt: Date;
        updatedAt: Date;
        servicioId: string;
        pedidoId: string | null;
    }[]>;
}
