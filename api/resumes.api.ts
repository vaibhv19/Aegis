import { APIResponse } from '@playwright/test';
import { BaseApi } from './base.api.js';

export class ResumesApi extends BaseApi {
  /**
   * Uploads a versioned PDF resume under a specific career persona (profile).
   */
  async uploadResume(
    profileId: string,
    fileBuffer: Buffer,
    filename: string,
    changelogNotes: string
  ): Promise<APIResponse> {
    return this.postMultipart(`/api/resumes/profile/${profileId}`, {
      file: {
        name: filename,
        mimeType: 'application/pdf',
        buffer: fileBuffer,
      },
      changelog: changelogNotes,
    });
  }

  /**
   * Retrieves all resumes linked to a career persona (profile).
   */
  async listResumes(profileId: string): Promise<APIResponse> {
    return this.get(`/api/resumes/profile/${profileId}`);
  }
}
