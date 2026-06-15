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

  @IsOptional()
  @IsString()
  vehiculoId?: string;

  @IsString()
  origen: string;

  @IsString()
  destino: string;

  @IsDateString()
  fechaProgramada: string;
}