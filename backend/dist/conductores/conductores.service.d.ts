import { PrismaService } from '../prisma/prisma.service';
import { CreateConductorDto } from './dto/create-conductor.dto';
export declare class ConductoresService {
    private prisma;
    constructor(prisma: PrismaService);
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
