import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInitiativeDto } from './dto/create-initiative.dto';

// STUB: datos en memoria hasta migración aprobada de tabla pmo_initiatives
// Reemplazar this.store por prisma.pmoInitiative cuando la migración esté lista

@Injectable()
export class InitiativesService {
  private store: any[] = [];
  private seq = 1;

  async create(dto: CreateInitiativeDto, user: any) {
    const record = {
      id: `ini-${this.seq++}`,
      tenantId: user.tenant_id,
      avance: 0,
      estado: 'PLANIFICADO',
      ...dto,
      createdAt: new Date().toISOString(),
    };
    this.store.push(record);
    return record;
  }

  async findAll(user: any) {
    return this.store.filter(r => r.tenantId === user.tenant_id);
  }

  async findOne(id: string, user: any) {
    const item = this.store.find(r => r.id === id && r.tenantId === user.tenant_id);
    if (!item) throw new NotFoundException('Iniciativa no encontrada');
    return item;
  }

  async update(id: string, dto: Partial<CreateInitiativeDto>, user: any) {
    const idx = this.store.findIndex(r => r.id === id && r.tenantId === user.tenant_id);
    if (idx === -1) throw new NotFoundException('Iniciativa no encontrada');
    this.store[idx] = { ...this.store[idx], ...dto };
    return this.store[idx];
  }

  async remove(id: string, user: any) {
    const idx = this.store.findIndex(r => r.id === id && r.tenantId === user.tenant_id);
    if (idx === -1) throw new NotFoundException('Iniciativa no encontrada');
    const [deleted] = this.store.splice(idx, 1);
    return deleted;
  }
}
