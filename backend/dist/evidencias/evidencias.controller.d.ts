import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
export declare class EvidenciasController {
    private readonly evidenciasService;
    constructor(evidenciasService: EvidenciasService);
    create(dto: CreateEvidenciaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pedidoId: string | null;
        servicioId: string;
        tipo: string;
        urlArchivo: string | null;
        observacion: string | null;
        nombreArchivo: string | null;
        mimeType: string | null;
        tamanoArchivo: number | null;
    }>;
    findAll(): Promise<({
        servicio: {
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
        } & {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tipoServicio: string;
            origen: string | null;
            destino: string | null;
            fechaProgramada: Date | null;
            vehiculoId: string | null;
            conductorId: string | null;
            estado: string;
            pedidoId: string;
            fechaInicio: Date | null;
            fechaFin: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pedidoId: string | null;
        servicioId: string;
        tipo: string;
        urlArchivo: string | null;
        observacion: string | null;
        nombreArchivo: string | null;
        mimeType: string | null;
        tamanoArchivo: number | null;
    })[]>;
    findByPedido(pedidoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pedidoId: string | null;
        servicioId: string;
        tipo: string;
        urlArchivo: string | null;
        observacion: string | null;
        nombreArchivo: string | null;
        mimeType: string | null;
        tamanoArchivo: number | null;
    }[]>;
}
