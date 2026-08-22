import { test, expect } from '../../fixtures/test.fixture.js';

test.describe('Aegis Resume Page Visual Regression Tests', () => {
  test(
    'should match empty resumes page and upload modal form visual layouts',
    { tag: '@visual' },
    async ({ resumePage, page, authenticatedUser }) => {
      console.log(`Running resume visual test as: ${authenticatedUser.user.email}`);

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
    }
  );
});
