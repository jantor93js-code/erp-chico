import { PartialType } from '@nestjs/swagger';
import { CreateCarteraDto } from './create-cartera.dto';

export class UpdateCarteraDto extends PartialType(CreateCarteraDto) {}
