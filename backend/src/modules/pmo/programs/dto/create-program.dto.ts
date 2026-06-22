import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProgramDto {

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}