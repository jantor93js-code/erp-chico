import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';

@Controller('pmo/tasks/:id/comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    return this.commentsService.create(id, createCommentDto, req.user);
  }

  @Get()
  findByTask(@Param('id') id: string, @Req() req: any) {
    return this.commentsService.findByTask(id, req.user);
  }
}
