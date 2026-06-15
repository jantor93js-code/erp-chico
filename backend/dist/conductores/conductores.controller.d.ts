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
        cedula: string;
        telefono: string | null;
        activo: boolean;
    }>;
    findAll(): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        cedula: string;
        telefono: string | null;
        activo: boolean;
    }[]>;
}
