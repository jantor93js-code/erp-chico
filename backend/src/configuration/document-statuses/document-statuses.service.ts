import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentStatusDto } from './dto/create-document-status.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';

@Injectable()
export class DocumentStatusesService {
  constructor(private prisma: PrismaService) {}

  async create(createDocumentStatusDto: CreateDocumentStatusDto) {
    try {
      const existing = await this.prisma.documentStatusRef.findUnique({
        where: { codigo: createDocumentStatusDto.codigo },
      });

      if (existing) {
        throw new BadRequestException(
          `Ya existe un estado de documento con el código: ${createDocumentStatusDto.codigo}`,
        );
      }

      return await this.prisma.documentStatusRef.create({
        data: {
          ...createDocumentStatusDto,
          activo: createDocumentStatusDto.activo ?? true,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Error al crear el estado de documento');
    }
  }

  async findAll(skip?: number, take?: number) {
    const where = { activo: true };
    const [data, total] = await Promise.all([
      this.prisma.documentStatusRef.findMany({
        where,
        skip,
        take,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.documentStatusRef.count({ where }),
    ]);

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async findOne(id: string) {
    const documentStatus = await this.prisma.documentStatusRef.findUnique({
      where: { id },
    });

    if (!documentStatus) {
      throw new NotFoundException(`Estado de documento con id ${id} no encontrado`);
    }

    return documentStatus;
  }

  async update(id: string, updateDocumentStatusDto: UpdateDocumentStatusDto) {
    await this.findOne(id); // Validar que existe

    if (updateDocumentStatusDto.codigo) {
      const existing = await this.prisma.documentStatusRef.findUnique({
        where: { codigo: updateDocumentStatusDto.codigo },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `Ya existe otro estado de documento con el código: ${updateDocumentStatusDto.codigo}`,
        );
      }
    }

    return await this.prisma.documentStatusRef.update({
      where: { id },
      data: updateDocumentStatusDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validar que existe

    return await this.prisma.documentStatusRef.update({
      where: { id },
      data: { activo: false },
    });
  }

  async search(query: string) {
    return await this.prisma.documentStatusRef.findMany({
      where: {
        activo: true,
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { codigo: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async findAllActive() {
    return await this.prisma.documentStatusRef.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
