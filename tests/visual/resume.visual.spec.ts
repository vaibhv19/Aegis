import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';

test.describe('Aegis Resume Page Visual Regression Tests', () => {
  const password = 'TestPassword123!';

  test.beforeEach(async ({ loginPage, page }) => {
    const email = generateUniqueEmail('res_vis');
    await loginPage.navigateTo();
    await loginPage.switchToSignUp();
    await loginPage.fullNameInput.fill('Aegis Visual Tester');
    await loginPage.emailInput.fill(email);
    await loginPage.passwordInput.fill(password);
    await loginPage.signUpSubmitButton.click();
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('should match empty resumes page and upload modal form visual layouts', async ({
    resumePage,
    page,
  }) => {
    // 1. Go to Resumes page
    await resumePage.navigateToResumes();

    // 2. Full-page empty resumes view (masking header rounded-full dropdown)
    await expect(page).toHaveScreenshot('resumes-empty-view.png', {
      mask: [page.locator('header button.rounded-full')],
    });

    // 3. Open Upload Resume form modal
    await resumePage.openUploadModal();
    const formLocator = page.locator('form');
    await expect(formLocator).toBeVisible();
    await page.waitForTimeout(500); // allow pop-up zoom transitions to fully settle

    // 4. Component-level screenshot of Upload Resume form
    await expect(formLocator).toHaveScreenshot('resume-upload-form.png');
  });
});
