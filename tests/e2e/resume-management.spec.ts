import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';
import path from 'path';

test.describe('Aegis Resume Management E2E Tests', () => {
  // Before each test, register a clean user to isolate resumes
  test.beforeEach(async ({ loginPage }) => {
    const email = generateUniqueEmail('resume_user');
    await loginPage.navigateTo();
    await loginPage.switchToSignUp();
    await loginPage.fullNameInput.fill('Aegis Resume Tester');
    await loginPage.emailInput.fill(email);
    await loginPage.passwordInput.fill('TestPassword123!');
    await loginPage.signUpSubmitButton.click();
    await expect(loginPage.page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test(
    'should successfully upload a versioned resume PDF and verify it is listed',
    { tag: '@e2e' },
    async ({ dashboardPage, resumePage }) => {
      const absoluteFilePath = path.resolve('test-data/sample-resume.pdf');
      const changelogNotes = 'Aegis automated test upload - Version 1.0';

      // 1. Go to Resumes page
      await dashboardPage.resumesNavLink.click();

      // 2. Open upload resume modal
      await resumePage.openUploadModal();

      // 3. Upload file and fill details
      await resumePage.uploadResumeFile(absoluteFilePath, changelogNotes);

      // 4. Verify resume version list contains the file
      const card = resumePage.getResumeCardLocator('sample-resume.pdf');
      await expect(card).toBeVisible();
    }
  );
});
