import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(taskId: string, createDto: CreateCommentDto, user: any) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.tenantId !== user.tenant_id) throw new ForbiddenException('Access denied (tenant mismatch)');
    return this.prisma.taskComment.create({ data: { taskId, usuarioId: user.sub, comentario: createDto.comentario } });
  }

  async findByTask(taskId: string, user: any) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.tenantId !== user.tenant_id) throw new ForbiddenException('Access denied (tenant mismatch)');
    if (user.role !== 'PMO_ADMIN' && task.responsableId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }
    return this.prisma.taskComment.findMany({ where: { taskId }, include: { usuario: true } });
  }
}
