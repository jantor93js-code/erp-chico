import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';

@Injectable()
export class ProcessesService {
  constructor(private prisma: PrismaService) {}

  async create(createProcessDto: CreateProcessDto) {
    try {
      const existingProcess = await this.prisma.process.findUnique({
        where: { codigo: createProcessDto.codigo },
      });

      if (existingProcess) {
        throw new BadRequestException(`Ya existe un proceso con el código: ${createProcessDto.codigo}`);
      }

      return await this.prisma.process.create({
        data: {
          ...createProcessDto,
          estado: 'ACTIVO',
        },
        include: {
          area: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
          responsable: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Error al crear el proceso');
    }
  }

  async findAll(skip?: number, take?: number) {
    const where = { activo: true };
    const [data, total] = await Promise.all([
      this.prisma.process.findMany({
        where,
        include: {
          area: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
          responsable: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
        },
        skip,
        take,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.process.count({ where }),
    ]);

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async findOne(id: string) {
    const process = await this.prisma.process.findUnique({
      where: { id },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
        responsable: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });

    if (!process) {
      throw new NotFoundException(`Proceso con id ${id} no encontrado`);
    }

    return process;
  }

  async update(id: string, updateProcessDto: UpdateProcessDto) {
    await this.findOne(id); // Validar que existe

    if (updateProcessDto.codigo) {
      const existingProcess = await this.prisma.process.findUnique({
        where: { codigo: updateProcessDto.codigo },
      });

      if (existingProcess && existingProcess.id !== id) {
        throw new BadRequestException(
          `Ya existe otro proceso con el código: ${updateProcessDto.codigo}`,
        );
      }
    }

    return await this.prisma.process.update({
      where: { id },
      data: updateProcessDto,
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
        responsable: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validar que existe

    return await this.prisma.process.update({
      where: { id },
      data: { activo: false },
    });
  }

  async search(query: string) {
    return await this.prisma.process.findMany({
      where: {
        activo: true,
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { codigo: { contains: query, mode: 'insensitive' } },
          { descripcion: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
          },
        },
        responsable: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  async findByArea(areaId: string) {
    return await this.prisma.process.findMany({
      where: {
        areaId,
        activo: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
