import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInitiativeDto } from './dto/create-initiative.dto';

@Injectable()
export class InitiativesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateInitiativeDto) {
    return this.prisma.pmoInitiative.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        estado: dto.estado ?? 'ACTIVO',
        avance: dto.avance ?? 0,

        programa: {
          connect: {
            id: dto.programId,
          },
        },

        ...(dto.responsableId && {
          responsable: {
            connect: {
              id: dto.responsableId,
            },
          },
        }),
      },

      include: {
        programa: true,
        responsable: true,
      },
    });
  }

  async findAll() {
    return this.prisma.pmoInitiative.findMany({
      include: {
        programa: true,
        responsable: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.pmoInitiative.findUnique({
      where: { id },
      include: {
        programa: true,
        responsable: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Iniciativa no encontrada');
    }

    return item;
  }

  async update(id: string, dto: Partial<CreateInitiativeDto>) {

    const {
      programId,
      responsableId,
      ...rest
    } = dto;

    return this.prisma.pmoInitiative.update({
      where: { id },

      data: {
        ...rest,

        ...(programId && {
          programa: {
            connect: {
              id: programId,
            },
          },
        }),

        ...(responsableId && {
          responsable: {
            connect: {
              id: responsableId,
            },
          },
        }),
      },

      include: {
        programa: true,
        responsable: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.pmoInitiative.delete({
      where: { id },
    });
  }
}