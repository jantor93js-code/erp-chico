import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TaskStatusesService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskStatusDto: CreateTaskStatusDto) {
    try {
      const existing = await this.prisma.taskStatusRef.findUnique({
        where: { codigo: createTaskStatusDto.codigo },
      });

      if (existing) {
        throw new BadRequestException(
          `Ya existe un estado de tarea con el código: ${createTaskStatusDto.codigo}`,
        );
      }

      return await this.prisma.taskStatusRef.create({
        data: {
          ...createTaskStatusDto,
          activo: createTaskStatusDto.activo ?? true,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Error al crear el estado de tarea');
    }
  }

  async findAll(skip?: number, take?: number) {
    const where = { activo: true };
    const [data, total] = await Promise.all([
      this.prisma.taskStatusRef.findMany({
        where,
        skip,
        take,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.taskStatusRef.count({ where }),
    ]);

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async findOne(id: string) {
    const taskStatus = await this.prisma.taskStatusRef.findUnique({
      where: { id },
    });

    if (!taskStatus) {
      throw new NotFoundException(`Estado de tarea con id ${id} no encontrado`);
    }

    return taskStatus;
  }

  async update(id: string, updateTaskStatusDto: UpdateTaskStatusDto) {
    await this.findOne(id); // Validar que existe

    if (updateTaskStatusDto.codigo) {
      const existing = await this.prisma.taskStatusRef.findUnique({
        where: { codigo: updateTaskStatusDto.codigo },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `Ya existe otro estado de tarea con el código: ${updateTaskStatusDto.codigo}`,
        );
      }
    }

    return await this.prisma.taskStatusRef.update({
      where: { id },
      data: updateTaskStatusDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validar que existe

    return await this.prisma.taskStatusRef.update({
      where: { id },
      data: { activo: false },
    });
  }

  async search(query: string) {
    return await this.prisma.taskStatusRef.findMany({
      where: {
        activo: true,
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { codigo: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async findAllActive() {
    return await this.prisma.taskStatusRef.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
