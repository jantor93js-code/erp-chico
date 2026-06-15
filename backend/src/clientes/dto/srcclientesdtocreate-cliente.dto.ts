import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateClienteDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  identificacion: string;

  @IsString()
  @IsNotEmpty()
  razonSocial: string;

  tipoCliente?: string;
  contactoPrincipal?: string;
}