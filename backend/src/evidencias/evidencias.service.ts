import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';

@Injectable()
export class EvidenciasService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateEvidenciaDto) {
    return this.prisma.evidenciaServicio.create({
      data: dto,
    });
  }

 async findAll() {
  return this.prisma.evidenciaServicio.findMany({
    include: {
      servicio: {
        include: {
          pedido: {
            include: {
              cliente: true,
              cotizacion: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
}

  async findByPedido(
    pedidoId: string,
  ) {
    return this.prisma.evidenciaServicio.findMany({
      where: {
        pedidoId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}