import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
export declare class PagosController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
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
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                clienteId: string;
                ejecutivoId: string;
                fechaSolicitud: Date;
                descripcion: string | null;
                tipoServicio: string | null;
                numeroPedido: string | null;
                origen: string | null;
                destino: string | null;
                valorTotalPactado: number | null;
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
    findByFactura(facturaId: string): Promise<{
        id: string;
        valor: number;
        metodoPago: string;
        fechaPago: Date;
        createdAt: Date;
        updatedAt: Date;
        facturaId: string;
    }[]>;
}
