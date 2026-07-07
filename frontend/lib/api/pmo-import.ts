const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

type ImportPreviewResponse = {
  session: Record<string, unknown>;
  changeSet: Record<string, unknown>;
  persistencePlan: Record<string, unknown>;
};

type ImportRunResponse = {
  session: Record<string, unknown>;
  changeSet: Record<string, unknown>;
  persistencePlan: Record<string, unknown>;
  executionResult: Record<string, unknown>;
};

export const PMOImportApi = {
  async analyzeImport(payload: { source: unknown; tenantId: string; usuario: string }): Promise<ImportPreviewResponse> {
    const res = await fetch(`${API_BASE}/pmo/import/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Import preview failed HTTP ${res.status}: ${text}`);
    }

    return (await res.json()) as ImportPreviewResponse;
  },

  async executeImport(payload: { source: unknown; tenantId: string; usuario: string }): Promise<ImportRunResponse> {
    const res = await fetch(`${API_BASE}/pmo/import/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Import run failed HTTP ${res.status}: ${text}`);
    }

    return (await res.json()) as ImportRunResponse;
  },

  async getHistory(): Promise<unknown> {
    return Promise.reject(new Error('Not implemented'));
  },

  async getSession(_sessionId: string): Promise<unknown> {
    return Promise.reject(new Error('Not implemented'));
  },
};
