import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConductorDto } from './dto/create-conductor.dto';

@Injectable()
export class ConductoresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateConductorDto) {
    return this.prisma.conductor.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.conductor.findMany();
  }
}