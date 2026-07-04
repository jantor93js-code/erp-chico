import { Injectable } from '@nestjs/common';
import { ImportPreviewDto } from './dto/import-preview.dto';
import { ImportPreviewResponse } from './interfaces/import-preview-response.interface';

@Injectable()
export class ImportPreviewService {
  async preview(dto: ImportPreviewDto): Promise<ImportPreviewResponse> {
    throw new Error('Not implemented');
  }
}
