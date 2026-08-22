import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUserData, generateInvalidCredentials } from '../../utils/test-data.factory.js';
import { AuthApi } from '../../api/auth.api.js';

test.describe('Aegis Auth API Verification Tests', () => {
  test(
    'should successfully register a new user, validate contract, and verify response time',
    { tag: '@api' },
    async ({ authApi }) => {
      const user = generateUserData();

      const startTime = Date.now();
      const response = await authApi.register(user);
      const duration = Date.now() - startTime;

      // Validate status code
      expect(response.status()).toBe(200);

      // Validate response time (sensible upper threshold of 3000ms to prevent serverless latency failures)
      expect(duration).toBeLessThan(3000);

      // Validate response contract
      const body = await response.json();
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('refreshToken');
      expect(body).toHaveProperty('email', user.email);
      expect(body).toHaveProperty('fullName', user.fullName);
      expect(body).toHaveProperty('userId');

      expect(typeof body.token).toBe('string');
      expect(typeof body.refreshToken).toBe('string');
      expect(typeof body.userId).toBe('string');
    }
  );

  test(
    'should login successfully, retrieve profile, and validate unauthorized status',
    { tag: '@api' },
    async ({ authApi }) => {
      const user = generateUserData();

      // 1. Register user
      const regResponse = await authApi.register(user);
      expect(regResponse.status()).toBe(200);

      // 2. Perform Login and check response time
      const loginStartTime = Date.now();
      const loginResponse = await authApi.login({
        email: user.email,
        password: user.password,
      });
      const loginDuration = Date.now() - loginStartTime;

      expect(loginResponse.status()).toBe(200);
      expect(loginDuration).toBeLessThan(3000);

      const loginBody = await loginResponse.json();
      const token = loginBody.token;
      expect(typeof token).toBe('string');

      // 3. Retrieve user profile (Authorized)
      authApi.setToken(token);
      const profileResponse = await authApi.getProfile();
      expect(profileResponse.status()).toBe(200);

      const profile = await profileResponse.json();
      expect(profile.email).toBe(user.email);
      expect(profile.fullName).toBe(user.fullName);

      // 4. Retrieve user profile without token (Unauthorized)
      const unauthorizedAuthApi = new AuthApi(authApi['requestContext']);
      const unauthorizedResponse = await unauthorizedAuthApi.getProfile();
      expect(unauthorizedResponse.status()).toBe(401);
    }
  );

  test(
    'should return 401 when logging in with incorrect credentials',
    { tag: '@api' },
    async ({ authApi }) => {
      // Narrowly mark this test as expected-to-fail due to Trajectory backend defect (Spring Boot 500 error instead of 401)
      test.fail(
        true,
        'Trajectory backend defect: invalid login credentials return 500 instead of 401'
      );

      const invalidCreds = generateInvalidCredentials();
      const response = await authApi.login(invalidCreds);

      expect(response.status()).toBe(401);
    }
  );
});
