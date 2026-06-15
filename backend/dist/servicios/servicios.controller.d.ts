import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
export declare class ServiciosController {
    private readonly serviciosService;
    constructor(serviciosService: ServiciosService);
    create(dto: CreateServicioDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        estado: string;
        pedidoId: string;
        vehiculoId: string | null;
        origen: string;
        destino: string;
        fechaProgramada: Date;
        fechaEntregaReal: Date | null;
        conductorId: string | null;
    }>;
    findAll(): Promise<({
        vehiculo: {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            placa: string;
            tipoVehiculo: string | null;
            capacidadKg: number | null;
            esPropio: boolean;
        } | null;
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
        estado: string;
        pedidoId: string;
        vehiculoId: string | null;
        origen: string;
        destino: string;
        fechaProgramada: Date;
        fechaEntregaReal: Date | null;
        conductorId: string | null;
    })[]>;
}
