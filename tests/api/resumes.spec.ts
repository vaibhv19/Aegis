import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe('Aegis Resumes API Verification Tests', () => {
  const password = 'TestPassword123!';
  let token: string;
  let profileId: string;

  test.beforeEach(async ({ authApi, applicationsApi, resumesApi }) => {
    const email = generateUniqueEmail('resume_api');
    const registerResponse = await authApi.register({
      fullName: 'API Resume Tester',
      email,
      password,
    });
    expect(registerResponse.status()).toBe(200);

    const regBody = await registerResponse.json();
    token = regBody.token;

    // Authenticate API contexts
    resumesApi.setToken(token);
    applicationsApi.setToken(token);

    // Get career profile ID
    const profilesResponse = await applicationsApi.getProfiles();
    expect(profilesResponse.status()).toBe(200);
    const profiles = await profilesResponse.json();
    expect(profiles.length).toBeGreaterThan(0);
    profileId = profiles[0].id;
  });

  test(
    'should successfully upload a PDF resume via multipart API and list it',
    { tag: '@api' },
    async ({ resumesApi }) => {
      const absoluteFilePath = path.resolve('test-data/sample-resume.pdf');
      const fileBuffer = fs.readFileSync(absoluteFilePath);
      const filename = 'sample-resume.pdf';
      const changelogNotes = 'API upload verification - Version 1.0';

      // 1. UPLOAD resume
      const uploadStartTime = Date.now();
      const uploadResponse = await resumesApi.uploadResume(
        profileId,
        fileBuffer,
        filename,
        changelogNotes
      );
      const uploadDuration = Date.now() - uploadStartTime;

      expect(uploadResponse.status()).toBe(201);
      expect(uploadDuration).toBeLessThan(3000); // 3-second serverless cold start limit

      const body = await uploadResponse.json();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('fileName', filename);
      expect(body).toHaveProperty('changelog', changelogNotes);
      expect(body).toHaveProperty('profileId', profileId);

      // 2. LIST resumes and verify it contains the uploaded file
      const listResponse = await resumesApi.listResumes(profileId);
      expect(listResponse.status()).toBe(200);
      const resumes = await listResponse.json();
      expect(resumes.length).toBeGreaterThan(0);
      expect(resumes[0].fileName).toBe(filename);
    }
  );
});
