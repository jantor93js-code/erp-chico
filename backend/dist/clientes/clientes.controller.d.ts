import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
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
