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
          console.log('========== CONTRACT READER ==========');
          console.log('Documentos:', (parsed as any)?.documentos?.length ?? 0);

          const docs = (parsed as any)?.documentos ?? [];
          const pro = docs.filter((d: any) => d?.codigoDocumento === 'PRO-PROY-01');

          console.log('PRO-PROY-01:', pro.length);
          console.log(JSON.stringify(pro, null, 2));

          return parsed;
        } catch {
          throw new BadRequestException('Contrato JSON inválido');
        }
      }

      try {
        const content = await fs.readFile(filePathOrJson, 'utf-8');
        try {
          const parsed = JSON.parse(content);
          console.log('========== CONTRACT READER ==========');
          console.log('Documentos:', (parsed as any)?.documentos?.length ?? 0);

          const docs = (parsed as any)?.documentos ?? [];
          const pro = docs.filter((d: any) => d?.codigoDocumento === 'PRO-PROY-01');

          console.log('PRO-PROY-01:', pro.length);
          console.log(JSON.stringify(pro, null, 2));

          return parsed;
        } catch {
          throw new BadRequestException('Contrato JSON inválido');
        }
      } catch {
        throw new BadRequestException('Contrato inválido');
      }
    }

    console.log('========== CONTRACT READER ==========');
    console.log('Documentos:', (filePathOrJson as any)?.documentos?.length ?? 0);

    const docs = (filePathOrJson as any)?.documentos ?? [];
    const pro = docs.filter((d: any) => d?.codigoDocumento === 'PRO-PROY-01');

    console.log('PRO-PROY-01:', pro.length);
    console.log(JSON.stringify(pro, null, 2));

    return filePathOrJson;
  }

  async readContract(filePathOrJson: string | object): Promise<PmoImportContract | unknown> {
    return this.read(filePathOrJson);
  }
}
