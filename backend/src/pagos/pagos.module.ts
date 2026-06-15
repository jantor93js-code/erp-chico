import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';

@Module({
  imports: [PrismaModule],
  providers: [PagosService],
  controllers: [PagosController],
})
export class PagosModule {}