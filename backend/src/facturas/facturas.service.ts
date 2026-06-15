import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFacturaDto) {
    return this.prisma.factura.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.factura.findMany({
      include: {
        pedido: true,
      },
    });
  }
}