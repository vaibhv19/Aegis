import { APIResponse } from '@playwright/test';
import { BaseApi } from './base.api.js';

export class ApplicationsApi extends BaseApi {
  /**
   * Creates a new job application.
   */
  async createApplication(payload: Record<string, unknown>): Promise<APIResponse> {
    return this.post('/api/applications', payload);
  }

  /**
   * Retrieves a single job application by ID.
   */
  async getApplication(id: string): Promise<APIResponse> {
    return this.get(`/api/applications/${id}`);
  }

  /**
   * Updates an existing job application.
   */
  async updateApplication(id: string, payload: Record<string, unknown>): Promise<APIResponse> {
    return this.put(`/api/applications/${id}`, payload);
  }

  /**
   * Deletes a job application by ID.
   */
  async deleteApplication(id: string): Promise<APIResponse> {
    return this.delete(`/api/applications/${id}`);
  }

  /**
   * Retrieves all career personas (profiles).
   */
  async getProfiles(): Promise<APIResponse> {
    return this.get('/api/profiles');
  }

  /**
   * Lists job applications with optional filter params.
   */
  async listApplications(params?: Record<string, string | number | boolean>): Promise<APIResponse> {
    return this.get('/api/applications', params);
  }
}
