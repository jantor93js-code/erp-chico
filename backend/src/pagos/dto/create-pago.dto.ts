import { IsString, IsNumber } from 'class-validator';

export class CreatePagoDto {
  @IsString()
  facturaId: string;

  @IsNumber()
  valor: number;

  @IsString()
  metodoPago: string;
}