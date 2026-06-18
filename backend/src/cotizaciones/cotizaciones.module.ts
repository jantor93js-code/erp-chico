import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
})
export class CotizacionesModule {}