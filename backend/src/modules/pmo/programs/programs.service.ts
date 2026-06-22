import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateProgramDto) {
    return this.prisma.pmoProgram.create({
      data: {
        clientId: dto.clientId,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        estado: dto.estado ?? 'ACTIVO',
      },
      include: {
        cliente: true,
      },
    });
  }

  async findAll() {
    return this.prisma.pmoProgram.findMany({
      include: {
        cliente: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.pmoProgram.findUnique({
      where: { id },
      include: {
        cliente: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Programa no encontrado');
    }

    return item;
  }

  async update(id: string, dto: Partial<CreateProgramDto>) {
    return this.prisma.pmoProgram.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.pmoProgram.delete({
      where: { id },
    });
  }
}