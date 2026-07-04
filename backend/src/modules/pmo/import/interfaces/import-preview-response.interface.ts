export interface ImportPreviewResponse {
  id: string;
  summary: {
    recordsFound: number;
    warnings: string[];
    errors: string[];
  };
}
