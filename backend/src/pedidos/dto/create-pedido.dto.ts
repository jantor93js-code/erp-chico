import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreatePedidoDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  clienteId: string;

  @IsUUID()
  ejecutivoId: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  valorTotalPactado?: number;
}