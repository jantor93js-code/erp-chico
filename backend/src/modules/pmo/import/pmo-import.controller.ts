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
    return this.importService.preview(dto);
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

      throw new InternalServerErrorException('Error inesperado al ejecutar la importación PMO');
    }
  }

  @Get('status/:id')
  async status(@Param('id') id: string) {
    return this.importService.status(id);
  }
}
