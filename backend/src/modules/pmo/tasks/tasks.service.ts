import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, user: any) {
    const data: any = {
      ...createTaskDto,
      creadorId: user.sub,
      tenantId: user.tenant_id,
    };
    return this.prisma.task.create({ data });
  }

  async findAll(user: any) {
    // PMO_ADMIN sees all, others see only assigned
    const tenantFilter = { tenantId: user.tenant_id };
    if (user.role === 'PMO_ADMIN') {
      return this.prisma.task.findMany({ where: tenantFilter, include: { comentarios: true } });
    }
    return this.prisma.task.findMany({ where: { ...tenantFilter, responsableId: user.sub }, include: { comentarios: true } });
  }

  async findOne(id: string, user: any) {
    const task = await this.prisma.task.findUnique({ where: { id }, include: { comentarios: true } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.tenantId !== user.tenant_id) {
      throw new ForbiddenException('Access denied (tenant mismatch)');
    }
    if (user.role !== 'PMO_ADMIN' && task.responsableId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }
    return task;
  }

  async update(id: string, updateDto: UpdateTaskDto, user: any) {
    // only admin can update
    if (user.role !== 'PMO_ADMIN') throw new ForbiddenException('Only PMO_ADMIN can update tasks');
    await this.ensureExists(id, user.tenant_id);
    return this.prisma.task.update({ where: { id }, data: updateDto });
  }

  async remove(id: string, user: any) {
    if (user.role !== 'PMO_ADMIN') throw new ForbiddenException('Only PMO_ADMIN can delete tasks');
    await this.ensureExists(id, user.tenant_id);
    return this.prisma.task.delete({ where: { id } });
  }

  private async ensureExists(id: string, tenantId?: string) {
    const t = await this.prisma.task.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Task not found');
    if (tenantId && t.tenantId !== tenantId) throw new ForbiddenException('Access denied (tenant mismatch)');
  }
}
