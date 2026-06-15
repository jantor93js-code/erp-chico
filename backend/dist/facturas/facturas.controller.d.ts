import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
export declare class FacturasController {
    private readonly facturasService;
    constructor(facturasService: FacturasService);
    create(dto: CreateFacturaDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pedidoId: string;
        numeroFactura: string;
        valor: number;
        fechaVencimiento: Date;
        estadoPago: string;
        fechaEmision: Date;
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
            estado: string;
        };
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pedidoId: string;
        numeroFactura: string;
        valor: number;
        fechaVencimiento: Date;
        estadoPago: string;
        fechaEmision: Date;
    })[]>;
}
