import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { DetalleServiciosService } from './detalle-servicios.service';
import { DetalleServiciosController } from './detalle-servicios.controller';

@Module({
imports: [PrismaModule],
controllers: [DetalleServiciosController],
providers: [DetalleServiciosService],
})
export class DetalleServiciosModule {}
