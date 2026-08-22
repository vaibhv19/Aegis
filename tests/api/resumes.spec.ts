import { test, expect } from '../../fixtures/test.fixture.js';
import { generateResumeMetadata } from '../../utils/test-data.factory.js';
import fs from 'fs';
import path from 'path';

test.describe('Aegis Resumes API Verification Tests', () => {
  test(
    'should successfully upload a PDF resume via multipart API and list it',
    { tag: '@api' },
    async ({ resumesApi, applicationsApi, authenticatedUser }) => {
      console.log(`Running API resumes test as: ${authenticatedUser.user.email}`);

      // 1. Get career profile ID
      const profilesResponse = await applicationsApi.getProfiles();
      expect(profilesResponse.status()).toBe(200);
      const profiles = await profilesResponse.json();
      expect(profiles.length).toBeGreaterThan(0);
      const profileId = profiles[0].id;

      const absoluteFilePath = path.resolve('test-data/sample-resume.pdf');
      const fileBuffer = fs.readFileSync(absoluteFilePath);
      const filename = 'sample-resume.pdf';
      const resumeData = generateResumeMetadata();

      // 2. UPLOAD resume
      const uploadStartTime = Date.now();
      const uploadResponse = await resumesApi.uploadResume(
        profileId,
        fileBuffer,
        filename,
        resumeData.changelog
      );
      const uploadDuration = Date.now() - uploadStartTime;

      expect(uploadResponse.status()).toBe(201);
      expect(uploadDuration).toBeLessThan(3000); // 3-second serverless cold start limit

      const body = await uploadResponse.json();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('fileName', filename);
      expect(body).toHaveProperty('changelog', resumeData.changelog);
      expect(body).toHaveProperty('profileId', profileId);

      // 3. LIST resumes and verify it contains the uploaded file
      const listResponse = await resumesApi.listResumes(profileId);
      expect(listResponse.status()).toBe(200);
      const resumes = await listResponse.json();
      expect(resumes.length).toBeGreaterThan(0);
      expect(resumes[0].fileName).toBe(filename);
    }
  );
});
