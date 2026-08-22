import { test, expect } from '../../fixtures/test.fixture.js';
import { generateJobApplicationData } from '../../utils/test-data.factory.js';

test.describe('Aegis Job Application Lifecycle E2E Tests', () => {
  test(
    'should create, update, verify dynamic status conditional UI, and delete a job application',
    { tag: '@e2e' },
    async ({ dashboardPage, applicationPage, authenticatedUser, applicationsApi }) => {
      console.log(`Running E2E lifecycle test as: ${authenticatedUser.user.email}`);

      // 1. Get career profile ID using applicationsApi
      const profilesResponse = await applicationsApi.getProfiles();
      expect(profilesResponse.status()).toBe(200);
      const profiles = await profilesResponse.json();
      expect(profiles.length).toBeGreaterThan(0);
      const profileId = profiles[0].id;

      // 2. Generate application test data
      const appData = generateJobApplicationData(profileId);

      // 3. Click Add Application in Sidebar
      await dashboardPage.addApplicationButton.click();
      await expect(applicationPage.companyInput).toBeVisible();

      // 4. Fill basic details
      await applicationPage.fillBasicDetails(
        appData.companyName,
        appData.roleTitle,
        appData.location,
        appData.salary
      );

      // 5. Verify status field has options
      await expect(applicationPage.statusSelect).toBeVisible();

      // 6. Verify dynamic OA conditional field appearance
      await applicationPage.selectStatus('OA');
      await expect(applicationPage.oaTestLinkInput).toBeVisible();

      // 7. Verify dynamic Interview conditional field appearance
      await applicationPage.selectStatus('INTERVIEW');
      await expect(applicationPage.interviewMeetingLinkInput).toBeVisible();

      // 8. Fill in dynamic interview details
      await applicationPage.fillInterviewDetails(appData.meetingLink);

      // 9. Select career persona
      await applicationPage.selectPersona('Software Engineer');

      // 10. Save the application
      await applicationPage.saveApplication();

      // 11. Go to Applications list
      await dashboardPage.applicationsNavLink.click();

      // 12. Click on the created card/row
      await applicationPage.clickApplicationCard(appData.companyName);

      // 13. Verify saved details inside details view
      await expect(
        applicationPage.page.getByRole('heading', { name: appData.companyName })
      ).toBeVisible();
      await expect(applicationPage.page.getByText(appData.roleTitle)).toBeVisible();

      // 14. Delete the application
      await applicationPage.deleteCurrentApplication();

      // 15. Verify card is removed from list
      await expect(applicationPage.page.locator(`text=${appData.companyName}`)).not.toBeVisible();
    }
  );
});
