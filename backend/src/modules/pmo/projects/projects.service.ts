import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateProjectDto) {
    return this.prisma.pmoProject.create({
      data: {
        initiativeId: dto.initiativeId,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        codigo: dto.codigo,
        area: dto.area,
        objetivo: dto.objetivo,
        observaciones: dto.observaciones,
        estadoDocumental: dto.estadoDocumental,
        fuente: dto.fuente,
        liderId: dto.liderId,
        estado: dto.estado ?? 'ACTIVO',
        avance: dto.avance ?? 0,
        fechaInicio: dto.fechaInicio
          ? new Date(dto.fechaInicio)
          : undefined,
        fechaFin: dto.fechaFin
          ? new Date(dto.fechaFin)
          : undefined,
      },
     include: {
  iniciativa: {
    include: {
      programa: {
        include: {
          cliente: true,
        },
      },
    },
  },
},
    });
  }

  async findAll() {
  return this.prisma.pmoProject.findMany({
   include: {
  iniciativa: {
    include: {
      programa: {
        include: {
          cliente: true,
        },
      },
    },
  },

  tasks: {
    select: {
      id: true,
      estado: true,
    },
  },
},

      

    orderBy: {
      nombre: 'asc',
    },
  });
}
  async findOne(id: string) {
    const item = await this.prisma.pmoProject.findUnique({
      where: { id },
     include: {
  iniciativa: {
    include: {
      programa: {
        include: {
          cliente: true,
        },
      },
    },
  },
},
    });

    if (!item) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return item;
  }

  async update(
    id: string,
    dto: Partial<CreateProjectDto>,
  ) {
    const { initiativeId, ...rest } = dto;
    return this.prisma.pmoProject.update({
      where: { id },
      data: {
        ...rest,
        ...(initiativeId && {
          iniciativa: {
            connect: {
              id: initiativeId,
            },
          },
        }),
      },
      include: {
        iniciativa: {
          include: {
            programa: {
              include: {
                cliente: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            estado: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.pmoProject.delete({
      where: { id },
    });
  }
}