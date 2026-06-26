import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @IsNotEmpty()
  @IsIn(['VIGENTE', 'NO_VIGENTE'])
  estadoDocumental: string;

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
