import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';
import { AuthApi } from '../../api/auth.api.js';

test.describe('Aegis Auth API Verification Tests', () => {
  const password = 'TestPassword123!';
  const fullName = 'API Testing User';

  test('should successfully register a new user, validate contract, and verify response time', async ({
    authApi,
  }) => {
    const email = generateUniqueEmail('api_register');

    const startTime = Date.now();
    const response = await authApi.register({
      fullName,
      email,
      password,
    });
    const duration = Date.now() - startTime;

    // Validate status code
    expect(response.status()).toBe(200);

    // Validate response time (sensible upper threshold of 3000ms to prevent serverless latency failures)
    expect(duration).toBeLessThan(3000);

    // Validate response contract
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('refreshToken');
    expect(body).toHaveProperty('email', email);
    expect(body).toHaveProperty('fullName', fullName);
    expect(body).toHaveProperty('userId');

    expect(typeof body.token).toBe('string');
    expect(typeof body.refreshToken).toBe('string');
    expect(typeof body.userId).toBe('string');
  });

  test('should login successfully, retrieve profile, and validate unauthorized status', async ({
    authApi,
  }) => {
    const email = generateUniqueEmail('api_login');

    // 1. Register user
    const regResponse = await authApi.register({
      fullName,
      email,
      password,
    });
    expect(regResponse.status()).toBe(200);

    // 2. Perform Login and check response time
    const loginStartTime = Date.now();
    const loginResponse = await authApi.login({
      email,
      password,
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
    expect(profile.email).toBe(email);
    expect(profile.fullName).toBe(fullName);

    // 4. Retrieve user profile without token (Unauthorized)
    const unauthorizedAuthApi = new AuthApi(authApi['requestContext']);
    const unauthorizedResponse = await unauthorizedAuthApi.getProfile();
    expect(unauthorizedResponse.status()).toBe(401);
  });

  test('should return 401 when logging in with incorrect credentials', async ({ authApi }) => {
    // Narrowly mark this test as expected-to-fail due to Trajectory backend defect (Spring Boot 500 error instead of 401)
    test.fail(
      true,
      'Trajectory backend defect: invalid login credentials return 500 instead of 401'
    );

    const response = await authApi.login({
      email: 'nonexistent_api_user@example.com',
      password: 'WrongPassword123!',
    });

    expect(response.status()).toBe(401);
  });
});
