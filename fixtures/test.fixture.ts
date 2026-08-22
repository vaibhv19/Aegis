import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { DashboardPage } from '../pages/dashboard.page.js';
import { ApplicationPage } from '../pages/application.page.js';
import { ResumePage } from '../pages/resume.page.js';
import { AuthApi } from '../api/auth.api.js';
import { ApplicationsApi } from '../api/applications.api.js';
import { ResumesApi } from '../api/resumes.api.js';

type AegisFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  applicationPage: ApplicationPage;
  resumePage: ResumePage;
  authApi: AuthApi;
  applicationsApi: ApplicationsApi;
  resumesApi: ResumesApi;
};

/**
 * Custom Playwright test fixture extending base test parameters.
 * Automatically instantiates and injects page objects and API clients.
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
  authApi: async ({ request }, use) => {
    const authApi = new AuthApi(request);
    await use(authApi);
  },
  applicationsApi: async ({ request }, use) => {
    const applicationsApi = new ApplicationsApi(request);
    await use(applicationsApi);
  },
  resumesApi: async ({ request }, use) => {
    const resumesApi = new ResumesApi(request);
    await use(resumesApi);
  },
});

export { expect } from '@playwright/test';
