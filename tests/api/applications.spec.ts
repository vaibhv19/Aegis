import { test, expect } from '../../fixtures/test.fixture.js';
import { generateJobApplicationData } from '../../utils/test-data.factory.js';

test.describe('Aegis Applications API E2E Lifecycle Tests', () => {
  test(
    'should successfully execute a full job application CRUD lifecycle with contract & performance checks',
    { tag: '@api' },
    async ({ applicationsApi, authenticatedUser }) => {
      console.log(`Running API lifecycle test as: ${authenticatedUser.user.email}`);

      // 1. Get career profile ID
      const profilesResponse = await applicationsApi.getProfiles();
      expect(profilesResponse.status()).toBe(200);
      const profiles = await profilesResponse.json();
      expect(profiles.length).toBeGreaterThan(0);
      const profileId = profiles[0].id;

      // 2. Generate application test data
      const appData = generateJobApplicationData(profileId);

      // 3. CREATE application
      const createStartTime = Date.now();
      const createResponse = await applicationsApi.createApplication(appData);
      const createDuration = Date.now() - createStartTime;

      expect(createResponse.status()).toBe(201);
      expect(createDuration).toBeLessThan(3000); // 3-second serverless cold start limit

      const application = await createResponse.json();
      expect(application).toHaveProperty('id');
      expect(application.companyName).toBe(appData.companyName);
      expect(application.roleTitle).toBe(appData.roleTitle);
      expect(application.status).toBe('APPLIED');
      expect(typeof application.id).toBe('string');
      const applicationId = application.id;

      // 4. READ/GET application details
      const readResponse = await applicationsApi.getApplication(applicationId);
      expect(readResponse.status()).toBe(200);
      const readApp = await readResponse.json();
      expect(readApp.id).toBe(applicationId);
      expect(readApp.companyName).toBe(appData.companyName);

      // 5. UPDATE application status
      const updateResponse = await applicationsApi.updateApplication(applicationId, {
        id: applicationId,
        companyName: appData.companyName,
        roleTitle: appData.roleTitle,
        profileId,
        status: 'OA',
        oaDateTime: new Date().toISOString(),
        meetingLink: 'https://test-link.com',
        dateApplied: readApp.dateApplied,
      });
      expect(updateResponse.status()).toBe(200);
      const updatedApp = await updateResponse.json();
      expect(updatedApp.status).toBe('OA');
      expect(updatedApp.meetingLink).toBe('https://test-link.com');

      // 6. DELETE application
      const deleteResponse = await applicationsApi.deleteApplication(applicationId);
      expect(deleteResponse.ok()).toBe(true);

      // 7. VERIFY deletion (GET should return 404)
      const verifyResponse = await applicationsApi.getApplication(applicationId);
      expect(verifyResponse.status()).toBe(404);
    }
  );
});
