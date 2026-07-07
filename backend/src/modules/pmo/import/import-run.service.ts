import { Injectable } from '@nestjs/common';
import { ImportRunDto } from './dto/import-run.dto';
import { ImportStatusResponse } from './interfaces/import-status-response.interface';

@Injectable()
export class ImportRunService {
  async run(dto: ImportRunDto): Promise<ImportStatusResponse> {
    throw new Error('Not implemented');
  }

  async getStatus(id: string): Promise<ImportStatusResponse> {
    throw new Error('Not implemented');
  }
}
