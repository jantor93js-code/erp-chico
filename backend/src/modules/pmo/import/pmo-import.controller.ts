import { Body, Controller, Get, InternalServerErrorException, Param, Post, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PmoImportService } from './pmo-import.service';
import { ImportPreviewDto } from './dto/import-preview.dto';
import { ImportRunDto } from './dto/import-run.dto';
import { ImportApplicationService } from './services/import-application.service';

@ApiTags('PMO Import')
@Controller('pmo/import')
export class PmoImportController {
  constructor(
    private readonly importService: PmoImportService,
    private readonly importApplicationService: ImportApplicationService,
  ) {}

  @Post('preview')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async preview(@Body() dto: ImportPreviewDto) {
    try {
      console.log('========== CONTROLLER ==========');
      console.log('Documentos:', (dto.source as any)?.documentos?.length ?? 0);

      const docs = (dto.source as any)?.documentos ?? [];
      const pro = docs.filter((d: any) => d?.codigoDocumento === 'PRO-PROY-01');

      console.log('PRO-PROY-01:', pro.length);
      console.log(JSON.stringify(pro, null, 2));

      return this.importService.preview(dto);
    } catch (error) {
      console.error('========== PMO IMPORT ERROR ==========');
      console.error(error);
      console.error(error?.stack);
      throw error;
    }
  }

  @Post('run')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Ejecutar una importación PMO' })
  @ApiBody({ type: ImportRunDto })
  @ApiResponse({ status: 200, description: 'Importación ejecutada correctamente' })
  @ApiResponse({ status: 400, description: 'Contrato inválido' })
  @ApiResponse({ status: 500, description: 'Error inesperado en la importación' })
  async run(@Body() dto: ImportRunDto) {
    try {
      return await this.importApplicationService.execute(dto.source, dto.tenantId, dto.usuario);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('========== PMO IMPORT ERROR ==========');
      console.error(error);
      console.error(error?.stack);
      throw error;
    }
  }

  @Get('status/:id')
  async status(@Param('id') id: string) {
    return this.importService.status(id);
  }
}
