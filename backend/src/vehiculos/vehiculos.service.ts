import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';

@Injectable()
export class VehiculosService {
  constructor(private prisma: PrismaService) {}

  async create(createVehiculoDto: CreateVehiculoDto) {
    return this.prisma.vehiculo.create({
      data: createVehiculoDto,
    });
  }

  async findAll() {
    return this.prisma.vehiculo.findMany();
  }
}