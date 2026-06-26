import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDocumentDto) {
    const requiredFields = [
      { value: dto.codigo, message: 'Código es obligatorio' },
      { value: dto.nombre, message: 'Nombre es obligatorio' },
      { value: dto.tipoId, message: 'Seleccione tipo documental' },
      { value: dto.areaId, message: 'Seleccione área' },
      { value: dto.procesoId, message: 'Seleccione proceso' },
      { value: dto.estadoDocumentalId, message: 'Seleccione estado documental' },
      { value: dto.responsableActualizacion, message: 'Responsable de actualización es obligatorio' },
      { value: dto.responsableRevision, message: 'Responsable de revisión es obligatorio' },
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        throw new BadRequestException(field.message);
      }
    }

    // Verificar unicidad de codigo antes de intentar crear para evitar error P2002
    const existsByCodigo = await this.prisma.document.findUnique({ where: { codigo: dto.codigo } });
    if (existsByCodigo) {
      throw new BadRequestException('Código de documento ya existe');
    }

    const data: any = {
      codigo: dto.codigo,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      version: dto.version,
      responsableActualizacion: dto.responsableActualizacion,
      responsableRevision: dto.responsableRevision,
      fechaCreacion: dto.fechaCreacion ? new Date(dto.fechaCreacion) : new Date(),
      fechaRevision: dto.fechaRevision ? new Date(dto.fechaRevision) : undefined,
      observaciones: dto.observaciones,
      enlace: dto.enlace,
      fuente: dto.fuente ?? 'MANUAL',
      activo: dto.activo ?? true,
    };

    const area = await this.prisma.area.findUnique({ where: { id: dto.areaId } });
    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }
    data.areaRef = { connect: { id: dto.areaId } };
    data.area = area.nombre;

    const process = await this.prisma.process.findUnique({ where: { id: dto.procesoId } });
    if (!process) {
      throw new NotFoundException('Proceso no encontrado');
    }
    data.processRef = { connect: { id: dto.procesoId } };
    data.proceso = process.nombre;

    const tipoRef = await this.prisma.documentTypeRef.findUnique({ where: { id: dto.tipoId } });
    if (!tipoRef) {
      throw new NotFoundException('Tipo documental no encontrado');
    }
    data.tipoRef = { connect: { id: dto.tipoId } };

    const estadoRef = await this.prisma.documentStatusRef.findUnique({ where: { id: dto.estadoDocumentalId } });
    if (!estadoRef) {
      throw new NotFoundException('Estado documental no encontrado');
    }
    data.estadoDocumentalRef = { connect: { id: dto.estadoDocumentalId } };

    if (dto.estadoDocumental) {
      data.estadoDocumental = dto.estadoDocumental;
    }

    return this.prisma.document.create({
      data,
      include: {
        cliente: true,
        programa: true,
        iniciativa: true,
        proyecto: true,
        areaRef: true,
        processRef: true,
        tipoRef: true,
        estadoDocumentalRef: true,
      } as any,
    });
  }

  async findAll() {
    return this.prisma.document.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' },
      include: {
        cliente: true,
        programa: true,
        iniciativa: true,
        proyecto: true,
        areaRef: true,
        processRef: true,
        tipoRef: true,
        estadoDocumentalRef: true,
      } as any,
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.document.findUnique({
      where: { id },
      include: {
        cliente: true,
        programa: true,
        iniciativa: true,
        proyecto: true,
        areaRef: true,
        processRef: true,
        tipoRef: true,
        estadoDocumentalRef: true,
      } as any,
    });

    if (!item) {
      throw new NotFoundException('Documento no encontrado');
    }

    return item;
  }

  async update(id: string, dto: UpdateDocumentDto) {
    await this.findOne(id);

    const data: any = {
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      version: dto.version,
      responsableActualizacion: dto.responsableActualizacion,
      responsableRevision: dto.responsableRevision,
      fechaCreacion: dto.fechaCreacion ? new Date(dto.fechaCreacion) : undefined,
      fechaRevision: dto.fechaRevision ? new Date(dto.fechaRevision) : undefined,
      observaciones: dto.observaciones,
      enlace: dto.enlace,
      fuente: dto.fuente,
      activo: dto.activo,
    };

    if (dto.codigo !== undefined) {
      data.codigo = dto.codigo;
    }

    if (dto.areaId !== undefined) {
      if (!dto.areaId) {
        throw new BadRequestException('Área es obligatoria');
      }
      const area = await this.prisma.area.findUnique({ where: { id: dto.areaId } });
      if (!area) {
        throw new NotFoundException('Área no encontrada');
      }
      data.areaRef = { connect: { id: dto.areaId } };
      data.area = area.nombre;
    }

    if (dto.procesoId !== undefined) {
      if (!dto.procesoId) {
        throw new BadRequestException('Proceso es obligatorio');
      }
      const process = await this.prisma.process.findUnique({ where: { id: dto.procesoId } });
      if (!process) {
        throw new NotFoundException('Proceso no encontrado');
      }
      data.processRef = { connect: { id: dto.procesoId } };
      data.proceso = process.nombre;
    }

    if (dto.tipoId !== undefined) {
      if (!dto.tipoId) {
        throw new BadRequestException('Tipo documental es obligatorio');
      }
      const tipoRef = await this.prisma.documentTypeRef.findUnique({ where: { id: dto.tipoId } });
      if (!tipoRef) {
        throw new NotFoundException('Tipo documental no encontrado');
      }
      data.tipoRef = { connect: { id: dto.tipoId } };
    }

    if (dto.estadoDocumentalId !== undefined) {
      if (!dto.estadoDocumentalId) {
        throw new BadRequestException('Seleccione estado documental');
      }
      const estadoRef = await this.prisma.documentStatusRef.findUnique({ where: { id: dto.estadoDocumentalId } });
      if (!estadoRef) {
        throw new NotFoundException('Estado documental no encontrado');
      }
      data.estadoDocumentalRef = { connect: { id: dto.estadoDocumentalId } };
    }

    if (dto.estadoDocumental !== undefined) {
      data.estadoDocumental = dto.estadoDocumental;
    }

    return this.prisma.document.update({
      where: { id },
      data,
      include: {
        cliente: true,
        programa: true,
        iniciativa: true,
        proyecto: true,
        areaRef: true,
        processRef: true,
        tipoRef: true,
        estadoDocumentalRef: true,
      } as any,
    });
  }

  async getDashboardMetrics() {
    const total = await this.prisma.document.count();
    const active = await this.prisma.document.count({ where: { activo: true } });
    const inactive = total - active;

    const byTipo = await this.prisma.document.groupBy({
      by: ['tipo'],
      _count: { tipo: true },
      orderBy: { tipo: 'asc' },
    });

    const byEstado = await this.prisma.document.groupBy({
      by: ['estadoDocumental'],
      _count: { estadoDocumental: true },
      orderBy: { estadoDocumental: 'asc' },
    });

    const byClienteCount = await this.prisma.document.groupBy({
      by: ['clienteId'],
      _count: { clienteId: true },
      where: { activo: true },
      orderBy: { clienteId: 'asc' },
    });

    const clientIds = byClienteCount.map((item) => item.clienteId).filter(Boolean) as string[];
    const clients = await this.prisma.pmoClient.findMany({
      where: { id: { in: clientIds } },
    });
    const clientNameById = new Map(clients.map((client) => [client.id, client.nombre]));

    return {
      total,
      active,
      inactive,
      byTipo: byTipo.map((item) => ({ tipo: item.tipo, count: item._count.tipo })),
      byEstado: byEstado.map((item) => ({ estado: item.estadoDocumental, count: item._count.estadoDocumental })),
      byCliente: byClienteCount.map((item) => ({
        clienteId: item.clienteId,
        clienteNombre: item.clienteId ? clientNameById.get(item.clienteId) ?? null : null,
        count: item._count.clienteId,
      })),
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.document.update({
      where: { id },
      data: { activo: false },
    });
  }
}
