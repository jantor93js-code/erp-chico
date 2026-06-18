import { ConductoresService } from './conductores.service';
import { CreateConductorDto } from './dto/create-conductor.dto';
export declare class ConductoresController {
    private readonly conductoresService;
    constructor(conductoresService: ConductoresService);
    create(dto: CreateConductorDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        activo: boolean;
        cedula: string;
        telefono: string | null;
    }>;
    findAll(): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        activo: boolean;
        cedula: string;
        telefono: string | null;
    }[]>;
}
