import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicioDto } from './dto/create-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateServicioDto) {
    return this.prisma.servicio.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.servicio.findMany({
      include: {
        pedido: true,
        vehiculo: true,
      },
    });
  }
}