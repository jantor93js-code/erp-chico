import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
export declare class ClientesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateClienteDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        identificacion: string;
        razonSocial: string;
        tipoCliente: string | null;
        contactoPrincipal: string | null;
    }>;
    findAll(): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        identificacion: string;
        razonSocial: string;
        tipoCliente: string | null;
        contactoPrincipal: string | null;
    }[]>;
}
