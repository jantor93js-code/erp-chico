export interface ImportStatusResponse {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  errorMessage?: string;
}
