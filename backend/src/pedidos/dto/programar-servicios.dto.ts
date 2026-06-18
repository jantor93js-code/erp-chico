import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class ProgramarPedidoDto {
@ApiProperty()
@IsDateString()
fechaProgramada: string;
}
