import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AsignarVehiculoDto {
@ApiProperty()
@IsUUID()
vehiculoId: string;
}
