import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
    return this.prisma.pedido.create({
      data: createPedidoDto,
    });
  }

  async findAll() {
    return this.prisma.pedido.findMany({
      include: {
        cliente: true,
        ejecutivo: true,
      },
    });
  }
}