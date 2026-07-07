/**
 * Shared document type catalog for Biblioteca Documental.
 * This is the single source of truth for document type values across the module.
 * Aligned with backend enum: Manual, Política, Procedimiento, Instructivo, Formato (FOR), Otros
 */

export const DOCUMENT_TYPE_CATALOG = [
  { id: 'manual', nombre: 'Manual', codigo: 'MANUAL' },
  { id: 'politica', nombre: 'Política', codigo: 'POLITICA' },
  { id: 'procedimiento', nombre: 'Procedimiento', codigo: 'PROCEDIMIENTO' },
  { id: 'instructivo', nombre: 'Instructivo', codigo: 'INSTRUCTIVO' },
  { id: 'formato', nombre: 'Formato (FOR)', codigo: 'FORMATO' },
  { id: 'otros', nombre: 'Otros', codigo: 'OTROS' },
] as const;

export type DocumentTypeId = typeof DOCUMENT_TYPE_CATALOG[number]['id'];
export type DocumentTypeCode = typeof DOCUMENT_TYPE_CATALOG[number]['codigo'];

/**
 * Map document type from various representations to the canonical type ID or name.
 */
export function normalizeDocumentType(value?: string | null): { id: DocumentTypeId; nombre: string } | null {
  if (!value) return null;

  const normalized = value.trim().toUpperCase();

  for (const type of DOCUMENT_TYPE_CATALOG) {
    if (type.id.toUpperCase() === normalized || type.codigo === normalized || type.nombre.toUpperCase() === normalized) {
      return { id: type.id as DocumentTypeId, nombre: type.nombre };
    }
  }

  // If no exact match, group as "Otros"
  return { id: 'otros', nombre: 'Otros' };
}

/**
 * Get display name for a document type ID or code.
 */
export function getDocumentTypeName(value?: string | null): string {
  if (!value) return 'Otros';
  const normalized = normalizeDocumentType(value);
  return normalized?.nombre || 'Otros';
}
