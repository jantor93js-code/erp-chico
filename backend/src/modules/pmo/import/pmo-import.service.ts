import { Injectable } from '@nestjs/common';
import { ImportPreviewDto } from './dto/import-preview.dto';
import { ImportRunDto } from './dto/import-run.dto';
import { ImportStatusResponse } from './interfaces/import-status-response.interface';
import { ImportPreviewResponse } from './interfaces/import-preview-response.interface';
import { ImportApplicationService } from './services/import-application.service';

@Injectable()
export class PmoImportService {
  constructor(private readonly importApplicationService: ImportApplicationService) {}

  async preview(dto: ImportPreviewDto): Promise<ImportPreviewResponse> {
    return this.importApplicationService.preview(dto.source, dto.tenantId, dto.usuario);
  }

  async run(dto: ImportRunDto): Promise<ImportStatusResponse> {
    throw new Error('Not implemented');
  }

  async status(id: string): Promise<ImportStatusResponse> {
    throw new Error('Not implemented');
  }
}
