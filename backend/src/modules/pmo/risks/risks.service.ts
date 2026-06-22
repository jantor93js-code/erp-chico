import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRiskDto } from './dto/create-risk.dto';

// STUB: datos en memoria hasta migración aprobada de tabla pmo_risks

@Injectable()
export class RisksService {
  private store: any[] = [];
  private seq = 1;

  async create(dto: CreateRiskDto, user: any) {
    const record = {
      id: `risk-${this.seq++}`,
      tenantId: user.tenant_id,
      impacto: 'Medio',
      probabilidad: 'Media',
      estado: 'Activo',
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
    if (!item) throw new NotFoundException('Riesgo no encontrado');
    return item;
  }

  async update(id: string, dto: Partial<CreateRiskDto>, user: any) {
    const idx = this.store.findIndex(r => r.id === id && r.tenantId === user.tenant_id);
    if (idx === -1) throw new NotFoundException('Riesgo no encontrado');
    this.store[idx] = { ...this.store[idx], ...dto };
    return this.store[idx];
  }

  async remove(id: string, user: any) {
    const idx = this.store.findIndex(r => r.id === id && r.tenantId === user.tenant_id);
    if (idx === -1) throw new NotFoundException('Riesgo no encontrado');
    const [deleted] = this.store.splice(idx, 1);
    return deleted;
  }
}
