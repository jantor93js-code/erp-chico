import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePagoDto) {
    const pago = await this.prisma.pago.create({
      data: dto,
    });

    await this.prisma.factura.update({
      where: {
        id: dto.facturaId,
      },
      data: {
        estadoPago: 'PAGADA',
      },
    });

    return pago;
  }

  async findAll() {
    return this.prisma.pago.findMany({
      include: {
        factura: true,
      },
    });
  }
}