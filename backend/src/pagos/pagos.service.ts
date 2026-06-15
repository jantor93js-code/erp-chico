import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePagoDto) {
    return this.prisma.pago.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.pago.findMany({
      include: {
        factura: true,
      },
    });
  }
}