import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        password: string;
        roleId: string;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
