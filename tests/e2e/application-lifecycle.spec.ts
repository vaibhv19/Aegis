import { test, expect } from '../../fixtures/test.fixture.js';
import { generateUniqueEmail } from '../../utils/helpers.js';

test.describe('Aegis Job Application Lifecycle E2E Tests', () => {
  // Before each test, register a clean user to isolate application records
  test.beforeEach(async ({ loginPage }) => {
    const email = generateUniqueEmail('app_user');
    await loginPage.navigateTo();
    await loginPage.switchToSignUp();
    await loginPage.fullNameInput.fill('Aegis Lifecycle Tester');
    await loginPage.emailInput.fill(email);
    await loginPage.passwordInput.fill('TestPassword123!');
    await loginPage.signUpSubmitButton.click();
    await expect(loginPage.page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('should create, update, verify dynamic status conditional UI, and delete a job application', async ({
    dashboardPage,
    applicationPage,
  }) => {
    const company = `Aegis Corp ${Date.now()}`;
    const role = 'Staff QA Engineer';
    const location = 'San Francisco, CA (Hybrid)';
    const salary = '$150,000 - $180,000';
    const link = 'https://zoom.us/interview-room';

    // 1. Click Add Application in Sidebar
    await dashboardPage.addApplicationButton.click();
    await expect(applicationPage.companyInput).toBeVisible();

    // 2. Fill basic details
    await applicationPage.fillBasicDetails(company, role, location, salary);

    // 3. Verify status field has options
    await expect(applicationPage.statusSelect).toBeVisible();

    // 4. Verify dynamic OA conditional field appearance
    await applicationPage.selectStatus('OA');
    await expect(applicationPage.oaTestLinkInput).toBeVisible();

    // 5. Verify dynamic Interview conditional field appearance
    await applicationPage.selectStatus('INTERVIEW');
    await expect(applicationPage.interviewMeetingLinkInput).toBeVisible();

    // 6. Fill in dynamic interview details
    await applicationPage.fillInterviewDetails(link);

    // 7. Select career persona
    await applicationPage.selectPersona('Software Engineer');

    // 8. Save the application
    await applicationPage.saveApplication();

    // 9. Go to Applications list
    await dashboardPage.applicationsNavLink.click();

    // 10. Click on the created card/row
    await applicationPage.clickApplicationCard(company);

    // 11. Verify saved details inside details view
    await expect(applicationPage.page.getByRole('heading', { name: company })).toBeVisible();
    await expect(applicationPage.page.getByText(role)).toBeVisible();

    // 12. Delete the application
    await applicationPage.deleteCurrentApplication();

    // 13. Verify card is removed from list
    await expect(applicationPage.page.locator(`text=${company}`)).not.toBeVisible();
  });
});
