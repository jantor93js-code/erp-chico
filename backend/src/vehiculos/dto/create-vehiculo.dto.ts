import { IsString, IsBoolean, IsUUID, IsOptional, IsInt } from 'class-validator';

export class CreateVehiculoDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  placa: string;

  @IsOptional()
  @IsString()
  tipoVehiculo?: string;

  @IsOptional()
  @IsInt()
  capacidadKg?: number;

  @IsOptional()
  @IsBoolean()
  esPropio?: boolean;
}