import { Injectable } from '@nestjs/common';
import { ImportPreviewDto } from './dto/import-preview.dto';
import { ImportRunDto } from './dto/import-run.dto';
import { ImportStatusResponse } from './interfaces/import-status-response.interface';
import { ImportPreviewResponse } from './interfaces/import-preview-response.interface';

@Injectable()
export class PmoImportService {
  async preview(dto: ImportPreviewDto): Promise<ImportPreviewResponse> {
    throw new Error('Not implemented');
  }

  async run(dto: ImportRunDto): Promise<ImportStatusResponse> {
    throw new Error('Not implemented');
  }

  async status(id: string): Promise<ImportStatusResponse> {
    throw new Error('Not implemented');
  }
}
