import { Controller, Get } from '@nestjs/common';
import { CarteraService } from './cartera.service';

@Controller('cartera')
export class CarteraController {
  constructor(
    private readonly carteraService:
      CarteraService,
  ) {}

  @Get()
  findAll() {
    return this.carteraService.findAll();
  }

  @Get('pendiente')
findPendientes() {
  return this.carteraService.findPendientes();
}

}
