import { IsString, IsOptional } from 'class-validator';

export class CreateConductorDto {
  @IsString()
  tenantId: string;

  @IsString()
  nombre: string;

  @IsString()
  cedula: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}