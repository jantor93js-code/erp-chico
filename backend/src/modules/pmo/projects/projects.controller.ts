import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller('pmo/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @Req() req: any) {
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
  update(@Param('id') id: string, @Body() dto: Partial<CreateProjectDto>, @Req() req: any) {
    return this.service.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(id, req.user);
  }
}
