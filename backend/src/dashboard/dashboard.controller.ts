import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Roles('ADMIN')
@ApiBearerAuth()


@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  getResumen() {
    return this.dashboardService.getResumen();
  }

  @Get('graficas')
  getGraficas() {
    return this.dashboardService.getGraficas();
  }
  @Get('test')
test(@Req() req) {
  return {
    headers: req.headers,
  };
}
}