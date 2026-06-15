import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
export declare class VehiculosController {
    private readonly vehiculosService;
    constructor(vehiculosService: VehiculosService);
    create(createVehiculoDto: CreateVehiculoDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        placa: string;
        tipoVehiculo: string | null;
        capacidadKg: number | null;
        esPropio: boolean;
    }>;
    findAll(): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        placa: string;
        tipoVehiculo: string | null;
        capacidadKg: number | null;
        esPropio: boolean;
    }[]>;
}
