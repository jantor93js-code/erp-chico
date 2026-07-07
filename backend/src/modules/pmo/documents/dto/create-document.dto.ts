import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsUUID()
  tipoId: string;

  @IsNotEmpty()
  @IsUUID()
  procesoId: string;

  @IsNotEmpty()
  @IsUUID()
  areaId: string;

  @IsNotEmpty()
  @IsUUID()
  estadoDocumentalId: string;

  @IsOptional()
  @IsString()
  estadoDocumental?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  vigencia?: string;

  @IsNotEmpty()
  @IsString()
  responsableActualizacion: string;

  @IsNotEmpty()
  @IsString()
  responsableRevision: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  codigoDependencia?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsDateString()
  fechaCreacion?: string;

  @IsOptional()
  @IsDateString()
  fechaRevision?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  enlace?: string;

  @IsOptional()
  @IsString()
  fuente?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
