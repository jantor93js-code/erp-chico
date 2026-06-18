import { PartialType } from '@nestjs/swagger';
import { CreateGastosOperativoDto } from './create-gastos-operativo.dto';

export class UpdateGastosOperativoDto extends PartialType(CreateGastosOperativoDto) {}
