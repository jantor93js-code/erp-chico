import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentEstado, DocumentType, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as xlsx from 'xlsx';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  private normalizeImportKeys(value: string): string {
    return String(value || '')
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[\s\-]+/g, '_')
      .replace(/[^\w_]/g, '')
      .toLowerCase();
  }

  private async parseExcelFile(file: Express.Multer.File): Promise<any[]> {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new BadRequestException('El archivo Excel no contiene hojas.');
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<any>(sheet, { defval: null, raw: false });

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new BadRequestException('El archivo Excel no contiene datos.');
    }

    return rows.map((row) => {
      const normalizedRow: Record<string, unknown> = {};
      Object.entries(row).forEach(([key, value]) => {
        normalizedRow[this.normalizeImportKeys(key)] = value;
      });
      return normalizedRow;
    });
  }

  async importFromFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo no proporcionado.');
    }

    const filename = file.originalname.toLowerCase();
    if (filename.endsWith('.json')) {
      const content = file.buffer.toString('utf-8');
      let records: any;
      try {
        records = JSON.parse(content);
      } catch (error) {
        throw new BadRequestException('Archivo JSON inválido.');
      }
      return this.importFromJson(records);
    }

    if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      const records = await this.parseExcelFile(file);
      return this.importFromJson(records);
    }

    throw new BadRequestException('Formato de archivo no soportado. Usa JSON o Excel.');
  }

  private computeVigencyFields(item: any) {
    const now = new Date();
    const fechaRevision = item.fechaRevision instanceof Date ? item.fechaRevision : item.fechaRevision ? new Date(item.fechaRevision) : undefined;
    let daysRemaining: number | null = null;
    let estadoVigencia: string | null = null;
    if (fechaRevision) {
      const diff = Math.ceil((fechaRevision.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      daysRemaining = diff;
      if (diff < 0) estadoVigencia = 'VENCIDO';
      else if (diff <= 30) estadoVigencia = 'PROXIMO_VENCER';
      else estadoVigencia = 'VIGENTE';
    }

    // If there's no fechaRevision, infer vigency from estadoDocumental enum when possible
    if (!fechaRevision) {
      const enumEstado = String(item.estadoDocumental || '').toUpperCase();
      if (enumEstado === 'VIGENTE') {
        estadoVigencia = estadoVigencia || 'VIGENTE';
      } else if (enumEstado === 'ARCHIVADO' || enumEstado === 'OBSOLETO') {
        estadoVigencia = estadoVigencia || 'VENCIDO';
      } else if (!estadoVigencia) {
        estadoVigencia = null;
      }
    }

    return {
      nextReview: fechaRevision || null,
      daysRemaining,
      estadoVigencia,
      // also expose `vigencia` key for frontend compatibility
      vigencia: estadoVigencia || undefined,
    };
  }

  private normalizeText(value?: string | null): string | undefined {
    if (!value) return undefined;
    const trimmed = String(value).trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private normalizeCatalogCode(value?: string | null): string {
    if (!value) return '';
    return String(value)
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .toUpperCase();
  }

  private parseNullableDate(value?: string | null): Date | undefined {
    const normalized = this.normalizeText(value);
    if (!normalized) return undefined;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  private isValidDocumentTypeCode(code?: string): code is DocumentType {
    return !!code && Object.values(DocumentType).includes(code as DocumentType);
  }

  private isValidDocumentEstadoCode(code?: string): code is DocumentEstado {
    return !!code && Object.values(DocumentEstado).includes(code as DocumentEstado);
  }

  private async findOrCreateDocumentType(
    tx: Prisma.TransactionClient | PrismaService,
    typeName: string,
    cache: Map<string, { id: string; codigo: string; nombre: string }>,
  ): Promise<{ entity: { id: string; codigo: string; nombre: string }; created: boolean }> {
    const normalizedCode = this.normalizeCatalogCode(typeName);
    if (cache.has(normalizedCode)) return { entity: cache.get(normalizedCode)!, created: false };

    const existing = await tx.documentTypeRef.findFirst({
      where: {
        OR: [
          { codigo: normalizedCode },
          { nombre: { equals: typeName, mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      cache.set(normalizedCode, existing);
      return { entity: existing, created: false };
    }

    const created = await tx.documentTypeRef.create({
      data: {
        nombre: typeName,
        codigo: normalizedCode || `TIPO_${Date.now()}`,
        descripcion: `Importado desde plantilla`,
        activo: true,
      },
    });

    cache.set(normalizedCode, created);
    return { entity: created, created: true };
  }

  private async findOrCreateDocumentStatus(
    tx: Prisma.TransactionClient | PrismaService,
    statusName: string,
    cache: Map<string, { id: string; codigo: string; nombre: string }>,
  ): Promise<{ entity: { id: string; codigo: string; nombre: string }; created: boolean }> {
    const normalizedCode = this.normalizeCatalogCode(statusName);
    if (cache.has(normalizedCode)) return { entity: cache.get(normalizedCode)!, created: false };

    const existing = await tx.documentStatusRef.findFirst({
      where: {
        OR: [
          { codigo: normalizedCode },
          { nombre: { equals: statusName, mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      cache.set(normalizedCode, existing);
      return { entity: existing, created: false };
    }

    const created = await tx.documentStatusRef.create({
      data: {
        nombre: statusName,
        codigo: normalizedCode || `ESTADO_${Date.now()}`,
        descripcion: `Importado desde plantilla`,
        activo: true,
        color: '#E5E7EB',
      },
    });

    cache.set(normalizedCode, created);
    return { entity: created, created: true };
  }

  private async findOrCreateArea(
    tx: Prisma.TransactionClient | PrismaService,
    areaName: string,
    cache: Map<string, { id: string; nombre: string; codigo: string }>,
  ): Promise<{ entity: { id: string; nombre: string; codigo: string }; created: boolean }> {
    const normalizedCode = this.normalizeCatalogCode(areaName);
    if (cache.has(normalizedCode)) return { entity: cache.get(normalizedCode)!, created: false };

    const existing = await tx.area.findFirst({
      where: {
        OR: [
          { codigo: normalizedCode },
          { nombre: { equals: areaName, mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      cache.set(normalizedCode, existing);
      return { entity: existing, created: false };
    }

    const created = await tx.area.create({
      data: {
        nombre: areaName,
        codigo: normalizedCode || `AREA_${Date.now()}`,
        estado: 'ACTIVO',
        activo: true,
      },
    });

    cache.set(normalizedCode, created);
    return { entity: created, created: true };
  }

  private async findOrCreateProcess(
    tx: Prisma.TransactionClient | PrismaService,
    processName: string,
    areaId: string | undefined,
    cache: Map<string, { id: string; nombre: string; codigo: string }>,
  ): Promise<{ entity: { id: string; nombre: string; codigo: string }; created: boolean }> {
    const normalizedCode = this.normalizeCatalogCode(processName);
    if (cache.has(normalizedCode)) return { entity: cache.get(normalizedCode)!, created: false };

    const existing = await tx.process.findFirst({
      where: {
        OR: [
          { codigo: normalizedCode },
          { nombre: { equals: processName, mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      if (!existing.areaId && areaId) {
        await tx.process.update({
          where: { id: existing.id },
          data: { areaId },
        });
      }
      cache.set(normalizedCode, existing);
      return { entity: existing, created: false };
    }

    const created = await tx.process.create({
      data: {
        nombre: processName,
        codigo: normalizedCode || `PROC_${Date.now()}`,
        areaId,
        estado: 'ACTIVO',
        activo: true,
      },
    });

    cache.set(normalizedCode, created);
    return { entity: created, created: true };
  }

  private buildLegacyEnumValues(data: any, tipoRef?: { codigo: string }, estadoRef?: { codigo: string }) {
    if (tipoRef?.codigo && this.isValidDocumentTypeCode(tipoRef.codigo)) {
      data.tipo = tipoRef.codigo;
    }
    if (estadoRef?.codigo && this.isValidDocumentEstadoCode(estadoRef.codigo)) {
      data.estadoDocumental = estadoRef.codigo;
    }
  }

  async importFromJson(records: any[]) {
    if (!Array.isArray(records)) {
      throw new BadRequestException('El cuerpo debe ser un arreglo de registros de documentos.');
    }

    if (records.length === 0) {
      throw new BadRequestException('No se encontraron registros para importar.');
    }

    const errors: string[] = [];
    type ImportRow = {
      codigo_manual: string;
      codigo_dependencia?: string;
      nombre_documento: string;
      tipo_documento?: string;
      proceso_asociado?: string;
      area_dependencia?: string;
      estado_documento?: string;
      responsable?: string;
      fecha_creacion?: string;
      fecha_ultima_revision?: string;
      observaciones?: string;
      enlace_drive?: string;
    };

    const normalizedRecords: ImportRow[] = records.map((record, index) => {
      // Map fields directly from JSON keys. For rows where `nombre_documento` is empty
      // we will set a clear placeholder ('por asignar'), but avoid swapping or
      // shifting `codigo_manual`/`codigo_dependencia` values so process and codes
      // remain correct.
      const row = {
        codigo_manual: this.normalizeText(record.codigo_manual) || this.normalizeText(record.codigo_dependencia),
        codigo_dependencia: this.normalizeText(record.codigo_dependencia) || this.normalizeText(record.codigo_manual),
        nombre_documento: this.normalizeText(record.nombre_documento) ?? undefined,
        tipo_documento: this.normalizeText(record.tipo_documento),
        proceso_asociado: this.normalizeText(record.proceso_asociado),
        area_dependencia: this.normalizeText(record.area_dependencia),
        estado_documento: this.normalizeText(record.estado_documento),
        responsable: this.normalizeText(record.responsable),
        fecha_creacion: this.normalizeText(record.fecha_creacion),
        fecha_ultima_revision: this.normalizeText(record.fecha_ultima_revision),
        observaciones: this.normalizeText(record.observaciones),
        enlace_drive: this.normalizeText(record.enlace_drive),
      } as ImportRow;

      // If name is missing, leave empty (or set a visible placeholder)
      if (!row.nombre_documento) {
        row.nombre_documento = 'por asignar';
      }

      if (!row.codigo_manual) {
        errors.push(`Fila ${index + 1}: codigo_manual o codigo_dependencia es obligatorio.`);
      }
      if (row.fecha_creacion && !this.parseNullableDate(row.fecha_creacion)) {
        errors.push(`Fila ${index + 1}: fecha_creacion no es una fecha válida.`);
      }
      if (row.fecha_ultima_revision && !this.parseNullableDate(row.fecha_ultima_revision)) {
        errors.push(`Fila ${index + 1}: fecha_ultima_revision no es una fecha válida.`);
      }

      return row;
    });

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Errores de validación en importación.', errors });
    }

    const typeCache = new Map<string, { id: string; codigo: string; nombre: string }>();
    const statusCache = new Map<string, { id: string; codigo: string; nombre: string }>();
    const areaCache = new Map<string, { id: string; nombre: string; codigo: string }>();
    const processCache = new Map<string, { id: string; nombre: string; codigo: string }>();
    const createdTypes: string[] = [];
    const createdStatuses: string[] = [];
    const createdAreas: string[] = [];
    const createdProcesses: string[] = [];

    const imported: Array<{ codigo_manual: string; action: 'created' | 'updated' }> = [];
    const tx = this.prisma;

    for (const row of normalizedRecords) {
      const tipoResult = row.tipo_documento
        ? await this.findOrCreateDocumentType(tx, row.tipo_documento, typeCache)
        : undefined;
      const tipoRef = tipoResult?.entity;
      if (tipoResult?.created && tipoRef) {
        createdTypes.push(tipoRef.nombre);
      }

      const estadoResult = row.estado_documento
        ? await this.findOrCreateDocumentStatus(tx, row.estado_documento, statusCache)
        : undefined;
      const estadoRef = estadoResult?.entity;
      if (estadoResult?.created && estadoRef) {
        createdStatuses.push(estadoRef.nombre);
      }

      const areaResult = row.area_dependencia
        ? await this.findOrCreateArea(tx, row.area_dependencia, areaCache)
        : undefined;
      const areaRef = areaResult?.entity;
      if (areaResult?.created && areaRef) {
        createdAreas.push(areaRef.nombre);
      }

      const processResult = row.proceso_asociado
        ? await this.findOrCreateProcess(tx, row.proceso_asociado, areaRef?.id, processCache)
        : undefined;
      const processRef = processResult?.entity;
      if (processResult?.created && processRef) {
        createdProcesses.push(processRef.nombre);
      }

      const data: any = {
        codigo: row.codigo_manual,
        nombre: row.nombre_documento,
        observaciones: row.observaciones,
        enlace: row.enlace_drive,
        fuente: 'IMPORTACION',
        origenImportacion: true,
        activo: true,
      };

      if (row.fecha_creacion) data.fechaCreacion = this.parseNullableDate(row.fecha_creacion);
      if (row.fecha_ultima_revision) data.fechaRevision = this.parseNullableDate(row.fecha_ultima_revision);
      if (row.responsable) {
        data.responsableActualizacion = row.responsable;
        data.responsableRevision = row.responsable;
      }

      if (areaRef) {
        data.areaRef = { connect: { id: areaRef.id } };
        data.area = areaRef.nombre;
      }

      if (processRef) {
        data.processRef = { connect: { id: processRef.id } };
        data.proceso = processRef.nombre;
      }

      if (tipoRef) {
        data.tipoRef = { connect: { id: tipoRef.id } };
      }

      if (estadoRef) {
        data.estadoDocumentalRef = { connect: { id: estadoRef.id } };
      }

      this.buildLegacyEnumValues(data, tipoRef, estadoRef);

      // Use a raw query to find existing document by codigo to avoid Prisma
      // client mapping errors when the DB schema is out-of-sync for some columns.
      const existingRows: Array<{ id: string } & any> = (await (tx as any).$queryRaw`
        SELECT id FROM documents WHERE codigo = ${row.codigo_manual}
      `) as any;

      // Defensive: remove any codigoDependencia keys that may be present
      // so Prisma doesn't attempt to access a DB column that doesn't exist.
      if (data && typeof data === 'object') {
        if ('codigoDependencia' in data) delete data.codigoDependencia;
        if ('codigo_dependencia' in data) delete data.codigo_dependencia;
      }

      // Build explicit DB columns and values for a raw upsert to avoid Prisma
      // model-mapping errors when the DB schema is out-of-sync (missing columns).
      const fechaCreacionVal = data.fechaCreacion ? data.fechaCreacion.toISOString() : null;
      const fechaRevisionVal = data.fechaRevision ? data.fechaRevision.toISOString() : null;
      const areaIdRef = areaRef?.id || null;
      const processIdRef = processRef?.id || null;
      const tipoIdRef = tipoRef?.id || null;
      const estadoDocumentalIdRef = estadoRef?.id || null;

      const sql = `
        INSERT INTO documents
          (codigo, nombre, observaciones, enlace, fuente, "origenImportacion", activo, area, proceso, tipo, "fechaCreacion", "fechaRevision", responsable_actualizacion, responsable_revision, "estadoDocumental", area_id_ref, process_id, tipo_id, estado_documental_id)
        VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::"DocumentType",$11,$12,$13,$14,$15::"DocumentEstado",$16::uuid,$17::uuid,$18::uuid,$19::uuid)
        ON CONFLICT (codigo) DO UPDATE SET
          nombre = EXCLUDED.nombre,
          observaciones = EXCLUDED.observaciones,
          enlace = EXCLUDED.enlace,
          fuente = EXCLUDED.fuente,
          "origenImportacion" = EXCLUDED."origenImportacion",
          activo = EXCLUDED.activo,
          area = EXCLUDED.area,
          proceso = EXCLUDED.proceso,
          tipo = EXCLUDED.tipo::"DocumentType",
          "fechaCreacion" = COALESCE(EXCLUDED."fechaCreacion", documents."fechaCreacion"),
          "fechaRevision" = COALESCE(EXCLUDED."fechaRevision", documents."fechaRevision"),
          responsable_actualizacion = EXCLUDED.responsable_actualizacion,
          responsable_revision = EXCLUDED.responsable_revision,
            "estadoDocumental" = EXCLUDED."estadoDocumental"::"DocumentEstado",
            area_id_ref = COALESCE(EXCLUDED.area_id_ref::uuid, documents.area_id_ref),
            process_id = COALESCE(EXCLUDED.process_id::uuid, documents.process_id),
            tipo_id = COALESCE(EXCLUDED.tipo_id::uuid, documents.tipo_id),
            estado_documental_id = COALESCE(EXCLUDED.estado_documental_id::uuid, documents.estado_documental_id)
      `;

      const params = [
        data.codigo,
        data.nombre,
        data.observaciones ?? null,
        data.enlace ?? null,
        data.fuente ?? 'IMPORTACION',
        true,
        data.activo ?? true,
        data.area ?? null,
        data.proceso ?? null,
        data.tipo ?? null,
        fechaCreacionVal,
        fechaRevisionVal,
        data.responsableActualizacion ?? null,
        data.responsableRevision ?? null,
        data.estadoDocumental ?? null,
        areaIdRef,
        processIdRef,
        tipoIdRef,
        estadoDocumentalIdRef,
      ];

      try {
        const result = await (tx as any).$executeRawUnsafe(sql, ...params);
        // Log outcome for debugging
        console.log('IMPORT: upserted document', data.codigo);
        // Mark as created/updated by checking existingRows
        if (existingRows && existingRows.length > 0 && existingRows[0].id) {
          imported.push({ codigo_manual: row.codigo_manual!, action: 'updated' });
        } else {
          imported.push({ codigo_manual: row.codigo_manual!, action: 'created' });
        }
      } catch (e) {
        console.error('IMPORT ERROR SQL', e);
        throw e;
      }
    }

    const results = imported;

    return {
      total: results.length,
      created: results.filter((item) => item.action === 'created').length,
      updated: results.filter((item) => item.action === 'updated').length,
      createdTypes: Array.from(new Set(createdTypes)),
      createdStatuses: Array.from(new Set(createdStatuses)),
      createdAreas: Array.from(new Set(createdAreas)),
      createdProcesses: Array.from(new Set(createdProcesses)),
    };
  }

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
      codigoDependencia: dto.codigoDependencia,
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

  async findAll(activo?: string) {
    // Use a raw query to avoid Prisma model->DB column mismatch (codigo_dependencia missing)
    const activoFilter = activo === 'false' ? false : true;

    const rows = await (this.prisma as any).$queryRawUnsafe(
      `SELECT d.id, d.codigo, d.nombre, d.descripcion, d.tipo::text as tipo, d.proceso, d.area, d.version, d.responsable_actualizacion, d.responsable_revision, d."estadoDocumental", d.area_id_ref, d.process_id, d.tipo_id, d.estado_documental_id,
         json_build_object('id', d.estado_documental_id, 'codigo', s.codigo, 'nombre', s.nombre) as "estadoDocumentalRef",
         d."fechaCreacion", d."fechaRevision", d.observaciones, d.enlace, d.fuente, d."origenImportacion", d.activo, d.cliente_id, d.program_id, d.initiative_id, d.project_id, d."createdAt", d."updatedAt"
       FROM documents d
       LEFT JOIN document_statuses s ON s.id = d.estado_documental_id
       WHERE d.activo = $1
       ORDER BY d."createdAt" DESC`,
      activoFilter,
    );

    return (rows as any[]).map((it) => ({ ...it, ...this.computeVigencyFields(it) }));
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

    return { ...item, ...this.computeVigencyFields(item) };
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
    if (dto.codigoDependencia !== undefined) {
      data.codigoDependencia = dto.codigoDependencia;
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

    const allDocuments = await this.prisma.document.findMany({
      include: {
        cliente: true,
        tipoRef: true,
        estadoDocumentalRef: true,
      },
    });

    const byTipoMap = new Map<string, number>();
    const byEstadoMap = new Map<string, number>();
    const byClienteMap = new Map<string, number>();

    allDocuments.forEach((doc) => {
      const tipoLabel = doc.tipoRef?.nombre || doc.tipo || 'OTRO';
      byTipoMap.set(tipoLabel, (byTipoMap.get(tipoLabel) || 0) + 1);

      const estadoLabel = doc.estadoDocumentalRef?.nombre || doc.estadoDocumental || 'DESCONOCIDO';
      byEstadoMap.set(estadoLabel, (byEstadoMap.get(estadoLabel) || 0) + 1);

      if (doc.clienteId) {
        byClienteMap.set(doc.clienteId, (byClienteMap.get(doc.clienteId) || 0) + 1);
      }
    });

    const byClienteCount = await this.prisma.document.groupBy({
      by: ['clienteId'],
      _count: { clienteId: true },
      orderBy: { clienteId: 'asc' },
    });

    const clientIds = byClienteCount.map((item) => item.clienteId).filter(Boolean) as string[];
    const clients = await this.prisma.pmoClient.findMany({
      where: { id: { in: clientIds } },
    });
    const clientNameById = new Map(clients.map((client) => [client.id, client.nombre]));
    // Additional KPIs
    const now = new Date();
    const upcomingThreshold = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const expired = await this.prisma.document.count({ where: { fechaRevision: { lt: now } } });
    const upcoming = await this.prisma.document.count({ where: { fechaRevision: { gte: now, lte: upcomingThreshold } } });

    const byTipoMapped = Array.from(byTipoMap.entries()).map(([tipo, count]) => ({ tipo, count }));
    const byEstadoMapped = Array.from(byEstadoMap.entries()).map(([estado, count]) => ({ estado, count }));

    const normalizeLabel = (s?: string) =>
      String(s || '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

    const manuals = byTipoMapped.reduce((acc, t) => acc + (normalizeLabel(t.tipo).includes('manual') ? t.count : 0), 0);
    const policies = byTipoMapped.reduce((acc, t) => acc + (normalizeLabel(t.tipo).includes('polit') ? t.count : 0), 0);

    const statusCount = (needle: string) =>
      byEstadoMapped.reduce((acc, s) => acc + (s.estado && s.estado.toString().toLowerCase().includes(needle) ? s.count : 0), 0);

    return {
      total,
      active,
      inactive,
      manuals,
      policies,
      pendientes: statusCount('pend'),
      en_estructuracion: statusCount('estruct'),
      en_revision: statusCount('revision'),
      aprobados: statusCount('aprob'),
      publicados: statusCount('public'),
      obsoletos: statusCount('obsol'),
      vencidos: expired,
      proximos_a_vencer: upcoming,
      byTipo: byTipoMapped,
      byEstado: byEstadoMapped,
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
