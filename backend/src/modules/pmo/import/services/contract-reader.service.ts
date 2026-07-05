import { BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { PmoImportContract } from '../interfaces/pmo-import-contract.interface';

export class ContractReaderService {
  async read(filePathOrJson: string | object): Promise<unknown> {
    if (typeof filePathOrJson === 'string') {
      const trimmed = filePathOrJson.trim();

      if (!trimmed) {
        throw new BadRequestException('Contrato inválido');
      }

      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed) as Record<string, unknown>;
          return parsed;
        } catch {
          throw new BadRequestException('Contrato JSON inválido');
        }
      }

      try {
        const content = await fs.readFile(filePathOrJson, 'utf-8');
        try {
          return JSON.parse(content);
        } catch {
          throw new BadRequestException('Contrato JSON inválido');
        }
      } catch {
        throw new BadRequestException('Contrato inválido');
      }
    }

    return filePathOrJson;
  }

  async readContract(filePathOrJson: string | object): Promise<PmoImportContract | unknown> {
    return this.read(filePathOrJson);
  }
}
