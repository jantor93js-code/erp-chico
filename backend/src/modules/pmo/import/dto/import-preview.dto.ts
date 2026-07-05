import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ImportPreviewDto {
  @ApiProperty({ description: 'Fuente del contrato a importar. Puede ser un JSON serializado o un objeto.', example: '{"metadata":{},"catalogos":{},"documentos":[]}' })
  @IsDefined()
  @IsNotEmpty()
  source: string | Record<string, unknown>;

  @ApiProperty({ description: 'Identificador del tenant', example: 'tenant-001' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Usuario que ejecuta la previsualización', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  usuario: string;
}
