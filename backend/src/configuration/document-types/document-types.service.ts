import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';

@Injectable()
export class DocumentTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createDocumentTypeDto: CreateDocumentTypeDto) {
    try {
      const existing = await this.prisma.documentTypeRef.findUnique({
        where: { codigo: createDocumentTypeDto.codigo },
      });

      if (existing) {
        throw new BadRequestException(
          `Ya existe un tipo de documento con el código: ${createDocumentTypeDto.codigo}`,
        );
      }

      return await this.prisma.documentTypeRef.create({
        data: {
          ...createDocumentTypeDto,
          activo: createDocumentTypeDto.activo ?? true,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Error al crear el tipo de documento');
    }
  }

  async findAll(skip?: number, take?: number) {
    const where = { activo: true };
    const [data, total] = await Promise.all([
      this.prisma.documentTypeRef.findMany({
        where,
        skip,
        take,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.documentTypeRef.count({ where }),
    ]);

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async findOne(id: string) {
    const documentType = await this.prisma.documentTypeRef.findUnique({
      where: { id },
    });

    if (!documentType) {
      throw new NotFoundException(`Tipo de documento con id ${id} no encontrado`);
    }

    return documentType;
  }

  async update(id: string, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    await this.findOne(id); // Validar que existe

    if (updateDocumentTypeDto.codigo) {
      const existing = await this.prisma.documentTypeRef.findUnique({
        where: { codigo: updateDocumentTypeDto.codigo },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `Ya existe otro tipo de documento con el código: ${updateDocumentTypeDto.codigo}`,
        );
      }
    }

    return await this.prisma.documentTypeRef.update({
      where: { id },
      data: updateDocumentTypeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Validar que existe

    return await this.prisma.documentTypeRef.update({
      where: { id },
      data: { activo: false },
    });
  }

  async search(query: string) {
    return await this.prisma.documentTypeRef.findMany({
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
    return await this.prisma.documentTypeRef.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
