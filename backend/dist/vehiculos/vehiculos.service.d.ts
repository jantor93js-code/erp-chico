import { PrismaService } from '../prisma/prisma.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
export declare class VehiculosService {
    private prisma;
    constructor(prisma: PrismaService);
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
