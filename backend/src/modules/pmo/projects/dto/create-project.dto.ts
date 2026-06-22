import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  responsable?: string;

  @IsString()
  @IsOptional()
  iniciativaId?: string;

  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaFin?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  avance?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
