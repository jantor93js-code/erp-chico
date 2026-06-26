import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsOptional()
  @IsUUID()
  responsableId?: string;
}
