import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
export declare class PedidosController {
    private readonly pedidosService;
    constructor(pedidosService: PedidosService);
    create(dto: CreatePedidoDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        ejecutivoId: string;
        descripcion: string | null;
        valorTotalPactado: number | null;
        fechaSolicitud: Date;
        estado: string;
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
        valorTotalPactado: number | null;
        fechaSolicitud: Date;
        estado: string;
    })[]>;
}
