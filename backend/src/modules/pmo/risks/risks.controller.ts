import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { RisksService } from './risks.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller('pmo/risks')
@UseGuards(JwtAuthGuard)
export class RisksController {
  constructor(private readonly service: RisksService) {}

  @Post()
  create(@Body() dto: CreateRiskDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateRiskDto>, @Req() req: any) {
    return this.service.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user);
  }
}
