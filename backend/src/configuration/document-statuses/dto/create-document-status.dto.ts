import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDocumentStatusDto {
  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
