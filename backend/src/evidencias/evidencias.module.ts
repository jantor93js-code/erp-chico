import { Module } from '@nestjs/common';
import { EvidenciasController } from './evidencias.controller';
import { EvidenciasService } from './evidencias.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EvidenciasController],
  providers: [
    EvidenciasService,
    PrismaService,
  ],
})
export class EvidenciasModule {}