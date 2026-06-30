import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private isAdmin(user: any) {
    const role = String(user?.role ?? '').trim().toLowerCase();
    return role === 'admin' || role === 'pmo-admin';
  }

  private taskInclude() {
    return {
      comentarios: true,
      responsable: {
        select: {
          id: true,
          nombre: true,
          email: true,
        },
      },
      proyecto: {
        select: {
          id: true,
          nombre: true,
          iniciativa: {
            select: {
              id: true,
              nombre: true,
              programa: {
                select: {
                  id: true,
                  nombre: true,
                  cliente: {
                    select: {
                      id: true,
                      nombre: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  async create(createTaskDto: CreateTaskDto, user: any) {
    const data: any = {
      ...createTaskDto,
      fechaInicio: createTaskDto.fechaInicio
        ? new Date(createTaskDto.fechaInicio)
        : undefined,
      fechaFin: createTaskDto.fechaFin
        ? new Date(createTaskDto.fechaFin)
        : undefined,
      fechaLimite: createTaskDto.fechaLimite
        ? new Date(createTaskDto.fechaLimite)
        : undefined,
      creadorId: user.sub,
      tenantId: user.tenant_id,
      codigo: createTaskDto.codigo ?? `TK-${randomUUID()}`,
    };
    return this.prisma.task.create({ data, include: this.taskInclude() });
  }

async findAll(user: any) {
  try {

    console.log('ENTRO A TASKS SERVICE');

    const tenantFilter = {
      tenantId: user.tenant_id,
    };

    console.log('TENANT FILTER:', tenantFilter);
    console.log('ROLE:', user.role);
    console.log('USER ID:', user.sub);

    let result;

    const include = this.taskInclude();

    if (this.isAdmin(user)) {

      result = await this.prisma.task.findMany({
        where: tenantFilter,
        include,
      });

    } else {

      result = await this.prisma.task.findMany({
        where: {
          ...tenantFilter,
          responsableId: user.sub,
        },
        include,
      });

    }

    console.log('RESULTADO TASKS:', result);

    return result;

  } catch (error) {

    console.log('ERROR TASKS SERVICE');
    console.log(error);

    throw error;

  }
}

  async findOne(id: string, user: any) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: this.taskInclude(),
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.tenantId !== user.tenant_id) {
      throw new ForbiddenException('Access denied (tenant mismatch)');
    }
    if (!this.isAdmin(user) && task.responsableId !== user.sub) {
      throw new ForbiddenException('Access denied');
    }
    return task;
  }

  async update(id: string, updateDto: UpdateTaskDto, user: any) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.tenantId !== user.tenant_id) {
      throw new ForbiddenException('Access denied (tenant mismatch)');
    }
    if (!this.isAdmin(user) && task.responsableId !== user.sub) {
      throw new ForbiddenException('Only the task responsable or PMO_ADMIN can update tasks');
    }

    const data: any = {
      ...updateDto,
      fechaInicio: updateDto.fechaInicio
        ? new Date(updateDto.fechaInicio)
        : undefined,
      fechaFin: updateDto.fechaFin
        ? new Date(updateDto.fechaFin)
        : undefined,
      fechaLimite: updateDto.fechaLimite
        ? new Date(updateDto.fechaLimite)
        : undefined,
    };

    return this.prisma.task.update({ where: { id }, data, include: this.taskInclude() });
  }

  async remove(id: string, user: any) {
    if (!this.isAdmin(user)) throw new ForbiddenException('Only PMO_ADMIN can delete tasks');
    await this.ensureExists(id, user.tenant_id);
    return this.prisma.task.delete({ where: { id } });
  }

  private async ensureExists(id: string, tenantId?: string) {
    const t = await this.prisma.task.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Task not found');
    if (tenantId && t.tenantId !== tenantId) throw new ForbiddenException('Access denied (tenant mismatch)');
  }
}
