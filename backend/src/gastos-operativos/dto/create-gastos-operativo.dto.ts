import {
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateGastosOperativoDto {
  @IsString()
  servicioId: string;

  @IsString()
  tipo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  valor: number;
}