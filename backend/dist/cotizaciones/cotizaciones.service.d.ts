import { PrismaService } from '../prisma/prisma.service';
export declare class CotizacionesService {
    private prisma;
    constructor(prisma: PrismaService);
    private generarNumeroCotizacion;
    create(dto: any): Promise<{
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
        ejecutivo: {
            email: string;
            password: string;
            roleId: string;
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }>;
    findAll(): Promise<({
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
        ejecutivo: {
            email: string;
            password: string;
            roleId: string;
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<({
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
        ejecutivo: {
            email: string;
            password: string;
            roleId: string;
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }) | null>;
    update(id: string, dto: any): Promise<{
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
    }>;
    private generarNumeroPedido;
    aceptar(id: string): Promise<{
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
        };
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
    }>;
    rechazar(id: string): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
