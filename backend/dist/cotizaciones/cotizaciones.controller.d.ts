import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';
export declare class CotizacionesController {
    private readonly cotizacionesService;
    constructor(cotizacionesService: CotizacionesService);
    create(createCotizacioneDto: CreateCotizacioneDto): Promise<{
        cliente: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            identificacion: string;
            razonSocial: string;
            tipoCliente: string | null;
            contactoPrincipal: string | null;
        };
        ejecutivo: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            roleId: string;
        };
    } & {
        id: string;
        tenantId: string;
        tipoServicio: string | null;
        descripcion: string | null;
        numeroCotizacion: string;
        origen: string;
        destino: string;
        valorCotizado: number;
        estado: string;
        fechaCreacion: Date;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        ejecutivoId: string;
    }>;
    findAll(): Promise<({
        cliente: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            identificacion: string;
            razonSocial: string;
            tipoCliente: string | null;
            contactoPrincipal: string | null;
        };
        ejecutivo: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            roleId: string;
        };
    } & {
        id: string;
        tenantId: string;
        tipoServicio: string | null;
        descripcion: string | null;
        numeroCotizacion: string;
        origen: string;
        destino: string;
        valorCotizado: number;
        estado: string;
        fechaCreacion: Date;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        ejecutivoId: string;
    })[]>;
    findOne(id: string): Promise<({
        cliente: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            identificacion: string;
            razonSocial: string;
            tipoCliente: string | null;
            contactoPrincipal: string | null;
        };
        ejecutivo: {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            roleId: string;
        };
    } & {
        id: string;
        tenantId: string;
        tipoServicio: string | null;
        descripcion: string | null;
        numeroCotizacion: string;
        origen: string;
        destino: string;
        valorCotizado: number;
        estado: string;
        fechaCreacion: Date;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        ejecutivoId: string;
    }) | null>;
    update(id: string, updateCotizacioneDto: UpdateCotizacioneDto): Promise<{
        id: string;
        tenantId: string;
        tipoServicio: string | null;
        descripcion: string | null;
        numeroCotizacion: string;
        origen: string;
        destino: string;
        valorCotizado: number;
        estado: string;
        fechaCreacion: Date;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        ejecutivoId: string;
    }>;
    aceptar(id: string): Promise<{
        cotizacion: {
            id: string;
            tenantId: string;
            tipoServicio: string | null;
            descripcion: string | null;
            numeroCotizacion: string;
            origen: string;
            destino: string;
            valorCotizado: number;
            estado: string;
            fechaCreacion: Date;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
            ejecutivoId: string;
        };
        pedido: {
            id: string;
            tenantId: string;
            tipoServicio: string | null;
            descripcion: string | null;
            origen: string | null;
            destino: string | null;
            estado: string;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
            ejecutivoId: string;
            fechaSolicitud: Date;
            numeroPedido: string | null;
            valorTotalPactado: number | null;
            origenPedido: string | null;
            fechaProgramada: Date | null;
            lineaNegocio: string;
            cotizacionId: string | null;
            vehiculoId: string | null;
            conductorId: string | null;
        };
    }>;
    rechazar(id: string): Promise<{
        id: string;
        tenantId: string;
        tipoServicio: string | null;
        descripcion: string | null;
        numeroCotizacion: string;
        origen: string;
        destino: string;
        valorCotizado: number;
        estado: string;
        fechaCreacion: Date;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        ejecutivoId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        tenantId: string;
        tipoServicio: string | null;
        descripcion: string | null;
        numeroCotizacion: string;
        origen: string;
        destino: string;
        valorCotizado: number;
        estado: string;
        fechaCreacion: Date;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        ejecutivoId: string;
    }>;
}
