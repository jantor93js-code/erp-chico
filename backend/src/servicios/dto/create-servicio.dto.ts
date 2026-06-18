import {
IsString,
IsOptional,
IsDateString,
} from 'class-validator';

export class CreateServicioDto {
@IsString()
tenantId: string;

@IsString()
pedidoId: string;

@IsString()
tipoServicio: string;

@IsOptional()
@IsString()
vehiculoId?: string;

@IsOptional()
@IsString()
conductorId?: string;

@IsString()
origen: string;

@IsString()
destino: string;

@IsDateString()
fechaProgramada: string;
}
