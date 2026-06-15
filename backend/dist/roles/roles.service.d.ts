import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createRoleDto: CreateRoleDto): Promise<{
        id: string;
        nombre: string;
        slug: string;
        permisos: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(): Promise<{
        id: string;
        nombre: string;
        slug: string;
        permisos: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
}
