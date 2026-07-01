import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('pmo/documents')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async importFromJson(@Body() records: any[], @UploadedFile() file?: Express.Multer.File) {
    try {
      if (file) {
        return await this.service.importFromFile(file);
      }
      return await this.service.importFromJson(records);
    } catch (err: any) {
      console.error('IMPORT ERROR:', err?.message ?? err, err?.stack ?? 'no-stack');
      return {
        statusCode: 500,
        message: 'Import failed',
        error: err?.message ?? String(err),
        stack: err?.stack ?? undefined,
      };
    }
  }

  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('activo') activo?: string) {
    return this.service.findAll(activo);
  }

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboardMetrics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
