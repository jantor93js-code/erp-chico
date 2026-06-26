import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DocumentStatusesService } from './document-statuses.service';
import { CreateDocumentStatusDto } from './dto/create-document-status.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';

@Controller('configuration/document-statuses')
@UseGuards(JwtAuthGuard)
export class DocumentStatusesController {
  constructor(private readonly documentStatusesService: DocumentStatusesService) {}

  @Post()
  create(@Body() createDocumentStatusDto: CreateDocumentStatusDto) {
    return this.documentStatusesService.create(createDocumentStatusDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.documentStatusesService.findAll(
      skip ? parseInt(skip) : undefined,
      take ? parseInt(take) : undefined,
    );
  }

  @Get('all/active')
  findAllActive() {
    return this.documentStatusesService.findAllActive();
  }

  @Get('search')
  search(@Query('q') query: string) {
    if (!query) {
      return { data: [] };
    }
    return this.documentStatusesService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentStatusesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentStatusDto: UpdateDocumentStatusDto,
  ) {
    return this.documentStatusesService.update(id, updateDocumentStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentStatusesService.remove(id);
  }
}
