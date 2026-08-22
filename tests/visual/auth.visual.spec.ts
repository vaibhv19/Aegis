import { test, expect } from '../../fixtures/test.fixture.js';

test.describe('Aegis Auth Pages Visual Regression Tests', () => {
  test('should match empty login page visual layout', async ({ loginPage, page }) => {
    await loginPage.navigateTo();
    await expect(page).toHaveScreenshot('login-page-empty.png');
  });

  test('should match empty signup page visual layout', async ({ loginPage, page }) => {
    await loginPage.navigateTo();
    await loginPage.switchToSignUp();
    await expect(page).toHaveScreenshot('signup-page-empty.png');
  });

  test('should match validation errors on empty login attempt', async ({ loginPage, page }) => {
    await loginPage.navigateTo();
    await loginPage.submitSignIn();
    await page.waitForTimeout(1000); // allow dynamic validation styling and transitions to settle
    await expect(page).toHaveScreenshot('login-validation-errors.png');
  });
});
