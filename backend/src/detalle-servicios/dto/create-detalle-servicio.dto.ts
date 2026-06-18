import {
IsUUID,
IsString,
IsNumber,
IsInt,
Min,
} from 'class-validator';

export class CreateDetalleServicioDto {
@IsUUID()
pedidoId: string;

@IsString()
nombre: string;

@IsInt()
@Min(1)
cantidad: number;

@IsNumber()
valorUnitario: number;

@IsNumber()
valorTotal: number;
}
