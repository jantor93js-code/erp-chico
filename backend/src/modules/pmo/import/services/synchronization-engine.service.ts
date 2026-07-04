import { Injectable } from '@nestjs/common';
import { ContractReaderService } from './contract-reader.service';
import { ContractValidatorService } from './contract-validator.service';
import { StatisticsBuilderService } from './statistics-builder.service';
import { PreviewBuilderService } from './preview-builder.service';
import { ImportPreview } from '../interfaces/import-preview.interface';
import { PmoImportContract } from '../interfaces/pmo-import-contract.interface';

@Injectable()
export class SynchronizationEngineService {
  constructor(
    private readonly contractReader: ContractReaderService,
    private readonly contractValidator: ContractValidatorService,
    private readonly statisticsBuilder: StatisticsBuilderService,
    private readonly previewBuilder: PreviewBuilderService,
  ) {}

  async preview(source: string | object): Promise<ImportPreview> {
    const contract = await this.contractReader.read(source);
    const validationResult = this.contractValidator.validate(contract);

    const typedContract = contract as PmoImportContract;
    const statistics = this.statisticsBuilder.build(typedContract);

    return this.previewBuilder.build(validationResult, statistics);
  }
}
