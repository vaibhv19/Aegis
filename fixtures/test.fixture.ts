import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { DashboardPage } from '../pages/dashboard.page.js';
import { ApplicationPage } from '../pages/application.page.js';
import { ResumePage } from '../pages/resume.page.js';

type AegisFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  applicationPage: ApplicationPage;
  resumePage: ResumePage;
};

/**
 * Custom Playwright test fixture extending base test parameters.
 * Automatically instantiates and injects page objects.
 */
export const test = baseTest.extend<AegisFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  applicationPage: async ({ page }, use) => {
    const applicationPage = new ApplicationPage(page);
    await use(applicationPage);
  },
  resumePage: async ({ page }, use) => {
    const resumePage = new ResumePage(page);
    await use(resumePage);
  },
});

export { expect } from '@playwright/test';
