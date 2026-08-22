import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';

test.describe('Aegis Applications API E2E Lifecycle Tests', () => {
  const password = 'TestPassword123!';
  let token: string;
  let profileId: string;

  test.beforeEach(async ({ authApi, applicationsApi }) => {
    const email = generateUniqueEmail('app_api');
    const registerResponse = await authApi.register({
      fullName: 'API App Tester',
      email,
      password,
    });
    expect(registerResponse.status()).toBe(200);

    const regBody = await registerResponse.json();
    token = regBody.token;

    // Authenticate API contexts
    authApi.setToken(token);
    applicationsApi.setToken(token);

    // Get career profile ID
    const profilesResponse = await applicationsApi.getProfiles();
    expect(profilesResponse.status()).toBe(200);
    const profiles = await profilesResponse.json();
    expect(profiles.length).toBeGreaterThan(0);
    profileId = profiles[0].id;
  });

  test(
    'should successfully execute a full job application CRUD lifecycle with contract & performance checks',
    { tag: '@api' },
    async ({ applicationsApi }) => {
      const companyName = `API Company ${Date.now()}`;
      const roleTitle = 'Principal Automation Engineer';

      // 1. CREATE application
      const createStartTime = Date.now();
      const createResponse = await applicationsApi.createApplication({
        companyName,
        roleTitle,
        profileId,
        status: 'APPLIED',
        dateApplied: new Date().toISOString().slice(0, 10),
      });
      const createDuration = Date.now() - createStartTime;

      expect(createResponse.status()).toBe(201);
      expect(createDuration).toBeLessThan(3000); // 3-second serverless cold start limit

      const application = await createResponse.json();
      expect(application).toHaveProperty('id');
      expect(application.companyName).toBe(companyName);
      expect(application.roleTitle).toBe(roleTitle);
      expect(application.status).toBe('APPLIED');
      expect(typeof application.id).toBe('string');
      const applicationId = application.id;

      // 2. READ/GET application details
      const readResponse = await applicationsApi.getApplication(applicationId);
      expect(readResponse.status()).toBe(200);
      const readApp = await readResponse.json();
      expect(readApp.id).toBe(applicationId);
      expect(readApp.companyName).toBe(companyName);

      // 3. UPDATE application status
      const updateResponse = await applicationsApi.updateApplication(applicationId, {
        id: applicationId,
        companyName,
        roleTitle,
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

      // 4. DELETE application
      const deleteResponse = await applicationsApi.deleteApplication(applicationId);
      expect(deleteResponse.ok()).toBe(true);

      // 5. VERIFY deletion (GET should return 404)
      const verifyResponse = await applicationsApi.getApplication(applicationId);
      expect(verifyResponse.status()).toBe(404);
    }
  );
});
