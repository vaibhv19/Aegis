import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';

test.describe('Aegis Dashboard Visual Regression Tests', () => {
  const password = 'TestPassword123!';

  test('should match dashboard visual layout for a fresh user', async ({ loginPage, page }) => {
    const email = generateUniqueEmail('dash_vis');

    // Register a dynamic user to guarantee a clean, stable empty dashboard state
    await loginPage.navigateTo();
    await loginPage.switchToSignUp();
    await loginPage.fullNameInput.fill('Aegis Visual Tester');
    await loginPage.emailInput.fill(email);
    await loginPage.passwordInput.fill(password);
    await loginPage.signUpSubmitButton.click();
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });

    // Mask the welcome greeting (which contains dynamic name) and profile menu button
    await expect(page).toHaveScreenshot('dashboard-empty-view.png', {
      mask: [
        page.getByRole('heading', { name: /Welcome/i }),
        page.locator('header button.rounded-full'),
      ],
    });
  });
});
