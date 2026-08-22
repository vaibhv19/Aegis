import { APIResponse } from '@playwright/test';
import { BaseApi } from './base.api.js';

export class AuthApi extends BaseApi {
  /**
   * Registers a new user account.
   */
  async register(payload: Record<string, string>): Promise<APIResponse> {
    return this.post('/api/auth/register', payload);
  }

  /**
   * Authenticates an existing user account.
   */
  async login(payload: Record<string, string>): Promise<APIResponse> {
    return this.post('/api/auth/login', payload);
  }

  /**
   * Retrieves the current authenticated user's profile.
   */
  async getProfile(): Promise<APIResponse> {
    return this.get('/api/users/profile');
  }
}
