import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUUID()
  responsableId?: string;
}
