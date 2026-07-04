import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DatabaseSnapshot } from '../interfaces/database-snapshot.interface';

@Injectable()
export class DatabaseSnapshotProviderService {
  constructor(private readonly prisma: PrismaService) {}

  async getSnapshot(): Promise<DatabaseSnapshot> {
    const [documentos, areas, procesos, estados, responsables, tiposDocumentales] = await Promise.all([
      this.prisma.document.findMany({ where: { activo: true } }),
      this.prisma.area.findMany({ where: { activo: true } }),
      this.prisma.process.findMany({ where: { activo: true } }),
      this.prisma.documentStatusRef.findMany({ where: { activo: true } }),
      this.prisma.user.findMany(),
      this.prisma.documentTypeRef.findMany({ where: { activo: true } }),
    ]);

    const codigosArea = areas.map(area => ({ id: area.id, codigo: area.codigo }));

    return {
      documentos,
      areas,
      procesos,
      estados,
      responsables,
      tiposDocumentales,
      codigosArea,
    };
  }
}
