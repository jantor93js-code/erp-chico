import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller('pmo/initiatives')
@UseGuards(JwtAuthGuard)
export class InitiativesController {
  constructor(private readonly service: InitiativesService) {}

  @Post()
  create(@Body() dto: CreateInitiativeDto, @Req() req: any) {
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
  update(@Param('id') id: string, @Body() dto: Partial<CreateInitiativeDto>, @Req() req: any) {
    return this.service.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user);
  }
}
