import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateClientDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  razonSocial?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}