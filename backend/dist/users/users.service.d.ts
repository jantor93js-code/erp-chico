import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        password: string;
        roleId: string;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<({
        tenant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            activo: boolean;
            nit: string;
        };
        role: {
            id: string;
            nombre: string;
            slug: string;
            permisos: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        email: string;
        password: string;
        roleId: string;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findByEmail(email: string): Promise<({
        tenant: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nombre: string;
            activo: boolean;
            nit: string;
        };
        role: {
            id: string;
            nombre: string;
            slug: string;
            permisos: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        email: string;
        password: string;
        roleId: string;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
