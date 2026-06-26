import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {

  const hashedPassword =
    await bcrypt.hash(
      createUserDto.password,
      10,
    );

  return this.prisma.user.create({
    data: {
  nombre: createUserDto.nombre,
  email: createUserDto.email,
  password: hashedPassword,
  scope: createUserDto.scope as any,
  roleId: createUserDto.roleId,
  tenantId: createUserDto.tenantId,
},
  });
  
}

  async findAll(scope?: string) {

  return this.prisma.user.findMany({

    where: scope
      ? { scope: scope as any }
      : undefined,

    include: {
      role: true,
      tenant: true,
    },

    orderBy: {
      nombre: 'asc',
    },

  });
}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        tenant: true,
      },
    });
  }

async update(
  id: string,
  dto: Partial<CreateUserDto>,
) {

  if (dto.password) {

    dto.password =
      await bcrypt.hash(
        dto.password,
        10,
      );
  }

  return this.prisma.user.update({
  where: { id },
  data: {
    nombre: dto.nombre,
    email: dto.email,
    password: dto.password,
    scope: dto.scope as any,
  },
});
}

async remove(id: string) {
  return this.prisma.user.delete({
    where: { id },
  });
}

}
