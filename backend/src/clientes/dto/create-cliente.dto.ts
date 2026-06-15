import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateClienteDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  identificacion: string;

  @IsString()
  razonSocial: string;

  @IsOptional()
  @IsString()
  tipoCliente?: string;

  @IsOptional()
  @IsString()
  contactoPrincipal?: string;
}