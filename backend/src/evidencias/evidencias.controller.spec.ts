import { Test, TestingModule } from '@nestjs/testing';
import { EvidenciasController } from './evidencias.controller';
import { EvidenciasService } from './evidencias.service';

describe('EvidenciasController', () => {
  let controller: EvidenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvidenciasController],
      providers: [EvidenciasService],
    }).compile();

    controller = module.get<EvidenciasController>(EvidenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
