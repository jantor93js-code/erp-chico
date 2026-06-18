import { PrismaService } from '../prisma/prisma.service';
import { CreateGastosOperativoDto } from './dto/create-gastos-operativo.dto';
export declare class GastosOperativosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateGastosOperativoDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        servicioId: string;
        tipo: string;
        valor: number;
        fecha: Date;
    }>;
    findAll(): Promise<({
        servicio: {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tipoServicio: string;
            origen: string | null;
            destino: string | null;
            fechaProgramada: Date | null;
            vehiculoId: string | null;
            conductorId: string | null;
            estado: string;
            pedidoId: string;
            fechaInicio: Date | null;
            fechaFin: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        servicioId: string;
        tipo: string;
        valor: number;
        fecha: Date;
    })[]>;
    findByServicio(servicioId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string | null;
        servicioId: string;
        tipo: string;
        valor: number;
        fecha: Date;
    }[]>;
}
