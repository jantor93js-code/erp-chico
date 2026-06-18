import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AsignarConductorDto {
@ApiProperty()
@IsUUID()
conductorId: string;
}
