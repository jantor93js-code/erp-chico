import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGastosOperativoDto } from './dto/create-gastos-operativo.dto';

@Injectable()
export class GastosOperativosService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(
    dto: CreateGastosOperativoDto,
  ) {
    return this.prisma.gastoOperativo.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.gastoOperativo.findMany({
      include: {
        servicio: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByServicio(
    servicioId: string,
  ) {
    return this.prisma.gastoOperativo.findMany({
      where: {
        servicioId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}