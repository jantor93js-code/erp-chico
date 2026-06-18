import { Test, TestingModule } from '@nestjs/testing';
import { GastosOperativosController } from './gastos-operativos.controller';
import { GastosOperativosService } from './gastos-operativos.service';

describe('GastosOperativosController', () => {
  let controller: GastosOperativosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GastosOperativosController],
      providers: [GastosOperativosService],
    }).compile();

    controller = module.get<GastosOperativosController>(GastosOperativosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
