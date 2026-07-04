import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportJobRepository {
  async createJob(payload: any): Promise<any> {
    throw new Error('Not implemented');
  }

  async getJobById(id: string): Promise<any> {
    throw new Error('Not implemented');
  }

  async updateJob(id: string, payload: any): Promise<any> {
    throw new Error('Not implemented');
  }
}
