import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateClientDto) {
    return this.prisma.pmoClient.create({
      data: {
        nombre: dto.nombre,
        razonSocial: dto.razonSocial,
        logoUrl: dto.logoUrl,
        estado: dto.estado ?? 'ACTIVO',
      },
    });
  }

  async findAll() {
    return this.prisma.pmoClient.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.pmoClient.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return item;
  }

  async update(id: string, dto: Partial<CreateClientDto>) {
    return this.prisma.pmoClient.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.pmoClient.delete({
      where: { id },
    });
  }
}