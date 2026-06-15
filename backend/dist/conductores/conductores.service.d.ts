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
