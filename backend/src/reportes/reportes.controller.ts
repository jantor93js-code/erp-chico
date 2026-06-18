import { Controller, Get } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {

  constructor(
    private readonly reportesService:
      ReportesService,
  ) {}

  @Get('financiero')
  financiero() {
    return this.reportesService.financiero();
  }
@Get('conductores-top')
conductoresTop() {
  return this.reportesService
    .conductoresTop();
}
@Get('clientes-top')
clientesTop() {
  return this.reportesService
    .clientesTop();
}

}