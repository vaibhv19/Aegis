import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '../config/env.js';

/**
 * Base API Client containing shared configuration, headers setup, and raw HTTP wrappers.
 */
export class BaseApi {
  protected requestContext: APIRequestContext;
  protected token?: string;

  constructor(requestContext: APIRequestContext, token?: string) {
    this.requestContext = requestContext;
    this.token = token;
  }

  /**
   * Sets the bearer authorization token for subsequent requests.
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Builds headers with optional bearer token.
   */
  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * Performs a GET request.
   */
  protected async get(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<APIResponse> {
    return this.requestContext.get(`${config.apiBaseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params,
    });
  }

  /**
   * Performs a POST request.
   */
  protected async post(endpoint: string, data?: unknown): Promise<APIResponse> {
    return this.requestContext.post(`${config.apiBaseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      data,
    });
  }

  /**
   * Performs a POST request with multipart form data.
   */
  protected async postMultipart(
    endpoint: string,
    multipart: Record<string, unknown>
  ): Promise<APIResponse> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return this.requestContext.post(`${config.apiBaseUrl}${endpoint}`, {
      headers,
      multipart,
    });
  }

  /**
   * Performs a PUT request.
   */
  protected async put(endpoint: string, data?: unknown): Promise<APIResponse> {
    return this.requestContext.put(`${config.apiBaseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      data,
    });
  }

  /**
   * Performs a DELETE request.
   */
  protected async delete(endpoint: string): Promise<APIResponse> {
    return this.requestContext.delete(`${config.apiBaseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
  }
}
