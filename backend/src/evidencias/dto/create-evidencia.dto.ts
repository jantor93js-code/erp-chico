import {
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateEvidenciaDto {
  @IsUUID()
 servicioId: string;

  @IsString()
  urlArchivo: string;

  @IsString()
  tipo: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}