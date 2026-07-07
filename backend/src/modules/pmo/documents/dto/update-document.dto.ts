import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  codigoDependencia?: string;

  @IsOptional()
  @IsUUID()
  tipoId?: string;

  @IsOptional()
  @IsUUID()
  procesoId?: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsOptional()
  @IsUUID()
  estadoDocumentalId?: string;

  @IsOptional()
  @IsString()
  estadoDocumental?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  vigencia?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  responsableActualizacion?: string;

  @IsOptional()
  @IsString()
  responsableRevision?: string;

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
