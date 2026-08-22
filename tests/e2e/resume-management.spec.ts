import { test, expect } from '../../fixtures/test.fixture.js';
import { generateResumeMetadata } from '../../utils/test-data.factory.js';
import path from 'path';

test.describe('Aegis Resume Management E2E Tests', () => {
  test(
    'should successfully upload a versioned resume PDF and verify it is listed',
    { tag: '@e2e' },
    async ({ dashboardPage, resumePage, authenticatedUser }) => {
      console.log(`Running E2E resumes test as: ${authenticatedUser.user.email}`);

      const absoluteFilePath = path.resolve('test-data/sample-resume.pdf');
      const resumeData = generateResumeMetadata();

      // 1. Go to Resumes page
      await dashboardPage.resumesNavLink.click();

      // 2. Open upload resume modal
      await resumePage.openUploadModal();

      // 3. Upload file and fill details
      await resumePage.uploadResumeFile(absoluteFilePath, resumeData.changelog);

      // 4. Verify resume version list contains the file
      const card = resumePage.getResumeCardLocator('sample-resume.pdf');
      await expect(card).toBeVisible();
    }
  );
});
