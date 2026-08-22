import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';

test.describe('Aegis Authentication E2E Tests', () => {
  const password = 'TestPassword123!';

  test('should successfully register a new user, logout, and sign back in', async ({
    loginPage,
    dashboardPage,
  }) => {
    const email = generateUniqueEmail('auth_user');

    // 1. Navigate to landing page
    await loginPage.navigateTo();

    // 2. Switch to Sign Up tab
    await loginPage.switchToSignUp();

    // 3. Fill registration details
    await loginPage.fullNameInput.fill('Aegis Automation User');
    await loginPage.emailInput.fill(email);
    await loginPage.passwordInput.fill(password);

    // 4. Submit sign up
    await loginPage.signUpSubmitButton.click();

    // 5. Verify redirect to dashboard
    await expect(loginPage.page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });

    // 6. Logout using the header profile dropdown
    await dashboardPage.logout();

    // 7. Verify back on Login page
    await expect(loginPage.page).toHaveURL(/.*\/login/);

    // 8. Sign back in
    await loginPage.fillSignInCredentials(email, password);
    await loginPage.submitSignIn();

    // 9. Confirm logged in again
    await expect(loginPage.page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('should fail to sign in with incorrect password', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.fillSignInCredentials('nonexistent@example.com', 'WrongPassword123!');
    await loginPage.submitSignIn();

    // Verify the URL did not change and remains on the login view
    await expect(loginPage.page).toHaveURL(/.*\/login/);
  });
});
