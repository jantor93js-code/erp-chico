import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async create(createAreaDto: CreateAreaDto) {
    try {
      const existingArea = await this.prisma.area.findUnique({
        where: { codigo: createAreaDto.codigo },
      });

      if (existingArea) {
        throw new BadRequestException(`Ya existe un área con el código: ${createAreaDto.codigo}`);
      }

      return await this.prisma.area.create({
        data: {
          ...createAreaDto,
          estado: 'ACTIVO',
        },
        include: {
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
      throw new BadRequestException('Error al crear el área');
    }
  }

  async findAll(skip?: number, take?: number) {
    const where = { activo: true };
    const [data, total] = await Promise.all([
      this.prisma.area.findMany({
        where,
        include: {
          responsable: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          procesos: {
            where: { activo: true },
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
        },
        skip,
        take,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.area.count({ where }),
    ]);

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async findOne(id: string) {
    const area = await this.prisma.area.findUnique({
      where: { id },
      include: {
        responsable: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        procesos: {
          where: { activo: true },
        },
      },
    });

    if (!area) {
      throw new NotFoundException(`Área con id ${id} no encontrada`);
    }

    return area;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    await this.findOne(id); // Validar que existe

    if (updateAreaDto.codigo) {
      const existingArea = await this.prisma.area.findUnique({
        where: { codigo: updateAreaDto.codigo },
      });

      if (existingArea && existingArea.id !== id) {
        throw new BadRequestException(
          `Ya existe otro área con el código: ${updateAreaDto.codigo}`,
        );
      }
    }

    return await this.prisma.area.update({
      where: { id },
      data: updateAreaDto,
      include: {
        responsable: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        procesos: {
          where: { activo: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validar que existe

    return await this.prisma.area.update({
      where: { id },
      data: { activo: false },
    });
  }

  async search(query: string) {
    return await this.prisma.area.findMany({
      where: {
        activo: true,
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { codigo: { contains: query, mode: 'insensitive' } },
          { descripcion: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        responsable: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }
}
