import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskStatusDto {
  @IsString()
  nombre: string;

  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
