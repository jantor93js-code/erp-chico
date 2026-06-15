import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateFacturaDto {
  @IsString()
  tenantId: string;

  @IsString()
  pedidoId: string;

  @IsString()
  numeroFactura: string;

  @IsNumber()
  valor: number;

  @IsDateString()
  fechaVencimiento: string;
}