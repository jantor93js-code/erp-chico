import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
export declare class FacturasController {
    private readonly facturasService;
    constructor(facturasService: FacturasService);
    create(dto: CreateFacturaDto): Promise<{
        id: string;
        numeroFactura: string;
        valor: number;
        estadoPago: string;
        fechaEmision: Date;
        fechaVencimiento: Date;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        pedidoId: string;
    }>;
    findAll(): Promise<{
        totalPagado: number;
        saldoPendiente: number;
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
        pagos: {
            id: string;
            valor: number;
            createdAt: Date;
            updatedAt: Date;
            facturaId: string;
            metodoPago: string;
            fechaPago: Date;
        }[];
        id: string;
        numeroFactura: string;
        valor: number;
        estadoPago: string;
        fechaEmision: Date;
        fechaVencimiento: Date;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        pedidoId: string;
    }[]>;
}
