import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const slug = createRoleDto.nombre.toLowerCase().replace(/ /g, '-');
    return this.prisma.role.create({
      data: {
        ...createRoleDto,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }
}