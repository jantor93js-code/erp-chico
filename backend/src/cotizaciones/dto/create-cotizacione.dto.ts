import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateCotizacioneDto {
  @IsString()
  tenantId: string;

  @IsString()
  clienteId: string;

  @IsUUID()
  ejecutivoId: string;

  @IsString()
  origen: string;

  @IsString()
  destino: string;

  @IsString()
  tipoServicio: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  valorCotizado: number;

  @IsOptional()
  @IsString()
  estado?: string;
}