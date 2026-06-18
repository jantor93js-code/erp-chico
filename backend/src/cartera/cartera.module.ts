import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CarteraController } from './cartera.controller';
import { CarteraService } from './cartera.service';

@Module({
  imports: [PrismaModule],
  controllers: [CarteraController],
  providers: [CarteraService],
})
export class CarteraModule {}