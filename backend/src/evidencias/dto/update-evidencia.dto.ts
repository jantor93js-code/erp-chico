import { PartialType } from '@nestjs/swagger';
import { CreateEvidenciaDto } from './create-evidencia.dto';

export class UpdateEvidenciaDto extends PartialType(CreateEvidenciaDto) {}
