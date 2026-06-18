import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { GastosOperativosService } from './gastos-operativos.service';
import { GastosOperativosController } from './gastos-operativos.controller';

@Module({
  imports: [PrismaModule],

  controllers: [
    GastosOperativosController,
  ],

  providers: [
    GastosOperativosService,
  ],
})
export class GastosOperativosModule {}