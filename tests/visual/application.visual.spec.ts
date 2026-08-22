import { test, expect } from '../../fixtures/test.fixture.js';

test.describe('Aegis Application Form Visual Regression Tests', () => {
  test(
    'should match Add Application modal form layouts for distinct status states',
    { tag: '@visual' },
    async ({ dashboardPage, applicationPage, page, authenticatedUser }) => {
      console.log(`Running application visual test as: ${authenticatedUser.user.email}`);

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
        maxDiffPixels: 2000,
      });

      // 4. OA Status (reveals conditional OA fields)
      await applicationPage.selectStatus('OA');
      await expect(applicationPage.oaDateInput).toBeVisible();
      await expect(formLocator).toHaveScreenshot('application-form-oa.png', {
        mask: [applicationPage.dateAppliedInput, applicationPage.oaDateInput],
        maxDiffPixels: 2000,
      });

      // 5. INTERVIEW Status (reveals conditional Interview fields)
      await applicationPage.selectStatus('INTERVIEW');
      await expect(applicationPage.interviewDateInput).toBeVisible();
      await expect(formLocator).toHaveScreenshot('application-form-interview.png', {
        mask: [applicationPage.dateAppliedInput, applicationPage.interviewDateInput],
        maxDiffPixels: 2000,
      });
    }
  );
});
