import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';

test.describe('Aegis Framework Verification Tests', () => {
  test(
    'verify LoginPage loads and tab switching works',
    { tag: '@framework' },
    async ({ loginPage }) => {
      // Navigate using custom page object
      await loginPage.navigateTo();

      // Verify initial state is the Sign In form
      await expect(loginPage.signInSubmitButton).toBeVisible();
      await expect(loginPage.fullNameInput).not.toBeVisible();

      // Switch to Sign Up tab
      await loginPage.switchToSignUp();

      // Verify field changes on Sign Up form
      await expect(loginPage.fullNameInput).toBeVisible();
      await expect(loginPage.signUpSubmitButton).toBeVisible();

      // Switch back to Sign In tab
      await loginPage.switchToSignIn();
      await expect(loginPage.signInSubmitButton).toBeVisible();
    }
  );

  test('verify unique email utility helper works', { tag: '@framework' }, () => {
    const email1 = generateUniqueEmail();
    const email2 = generateUniqueEmail();
    expect(email1).not.toBe(email2);
    expect(email1).toContain('@example.com');
  });
});
