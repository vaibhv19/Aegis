import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';

test.describe('Aegis Application Form Visual Regression Tests', () => {
  const password = 'TestPassword123!';

  test.beforeEach(async ({ loginPage, page }) => {
    const email = generateUniqueEmail('app_vis');
    await loginPage.navigateTo();
    await loginPage.switchToSignUp();
    await loginPage.fullNameInput.fill('Aegis Visual Tester');
    await loginPage.emailInput.fill(email);
    await loginPage.passwordInput.fill(password);
    await loginPage.signUpSubmitButton.click();
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('should match Add Application modal form layouts for distinct status states', async ({
    dashboardPage,
    applicationPage,
    page,
  }) => {
    // 1. Go to Applications page
    await applicationPage.navigateToApplicationsList();

    // 2. Open Add Application form
    await dashboardPage.addApplicationButton.click();
    const formLocator = page.locator('form');
    await expect(formLocator).toBeVisible();
    await page.waitForTimeout(500); // allow pop-up zoom transitions to fully settle

    // 3. APPLIED Status (default layout)
    await expect(formLocator).toHaveScreenshot('application-form-applied.png', {
      mask: [applicationPage.dateAppliedInput],
    });

    // 4. OA Status (reveals conditional OA fields)
    await applicationPage.selectStatus('OA');
    await expect(applicationPage.oaDateInput).toBeVisible();
    await expect(formLocator).toHaveScreenshot('application-form-oa.png', {
      mask: [applicationPage.dateAppliedInput, applicationPage.oaDateInput],
    });

    // 5. INTERVIEW Status (reveals conditional Interview fields)
    await applicationPage.selectStatus('INTERVIEW');
    await expect(applicationPage.interviewDateInput).toBeVisible();
    await expect(formLocator).toHaveScreenshot('application-form-interview.png', {
      mask: [applicationPage.dateAppliedInput, applicationPage.interviewDateInput],
    });
  });
});
