import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
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
