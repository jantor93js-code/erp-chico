import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';

@Module({
  imports: [AuthModule],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService],
})
export class AreasModule {}
