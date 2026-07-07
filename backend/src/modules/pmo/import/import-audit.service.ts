import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportAuditService {
  async recordAudit(event: string, payload: any): Promise<void> {
    throw new Error('Not implemented');
  }
}
