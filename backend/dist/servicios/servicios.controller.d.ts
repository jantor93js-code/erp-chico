import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
export declare class ServiciosController {
    private readonly serviciosService;
    constructor(serviciosService: ServiciosService);
    create(dto: CreateServicioDto): Promise<{
        id: string;
        origen: string;
        destino: string;
        estado: string;
        fechaProgramada: Date;
        fechaEntregaReal: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        pedidoId: string;
        vehiculoId: string | null;
    }>;
    findAll(): Promise<({
        pedido: {
            id: string;
            estado: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            clienteId: string;
            ejecutivoId: string;
            fechaSolicitud: Date;
            descripcion: string | null;
            valorTotalPactado: number | null;
        };
        vehiculo: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            placa: string;
            tipoVehiculo: string | null;
            capacidadKg: number | null;
            esPropio: boolean;
        } | null;
    } & {
        id: string;
        origen: string;
        destino: string;
        estado: string;
        fechaProgramada: Date;
        fechaEntregaReal: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        pedidoId: string;
        vehiculoId: string | null;
    })[]>;
}
