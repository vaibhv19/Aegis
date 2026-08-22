import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUserData, generateInvalidCredentials } from '../../utils/test-data.factory.js';

test.describe('Aegis Authentication E2E Tests', () => {
  test(
    'should successfully register a new user, logout, and sign back in',
    { tag: '@e2e' },
    async ({ loginPage, dashboardPage }) => {
      const user = generateUserData();

      // 1. Navigate to landing page and register E2E
      await loginPage.navigateTo();
      await loginPage.registerNewUser(user.fullName, user.email, user.password);

      // 2. Logout using the header profile dropdown
      await dashboardPage.logout();

      // 3. Verify back on Login page
      await expect(loginPage.page).toHaveURL(/.*\/login/);

      // 4. Sign back in
      await loginPage.loginUser(user.email, user.password);
    }
  );

  test('should fail to sign in with incorrect password', { tag: '@e2e' }, async ({ loginPage }) => {
    const invalidCreds = generateInvalidCredentials();

    await loginPage.navigateTo();
    await loginPage.fillSignInCredentials(invalidCreds.email, invalidCreds.password);
    await loginPage.submitSignIn();

    // Verify the URL did not change and remains on the login view
    await expect(loginPage.page).toHaveURL(/.*\/login/);
  });
});
