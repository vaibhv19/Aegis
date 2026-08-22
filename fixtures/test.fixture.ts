import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { DashboardPage } from '../pages/dashboard.page.js';
import { ApplicationPage } from '../pages/application.page.js';
import { ResumePage } from '../pages/resume.page.js';
import { AuthApi } from '../api/auth.api.js';
import { ApplicationsApi } from '../api/applications.api.js';
import { ResumesApi } from '../api/resumes.api.js';
import { generateUserData } from '../utils/test-data.factory.js';

type AegisFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  applicationPage: ApplicationPage;
  resumePage: ResumePage;
  authApi: AuthApi;
  applicationsApi: ApplicationsApi;
  resumesApi: ResumesApi;
  authenticatedUser: {
    token: string;
    user: ReturnType<typeof generateUserData>;
  };
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

    // Teardown: Automatically delete any applications created during the test
    if (applicationsApi.getToken()) {
      try {
        const appsRes = await applicationsApi.listApplications();
        if (appsRes.status() === 200) {
          const body = await appsRes.json();
          const apps = Array.isArray(body) ? body : body.content || [];
          for (const app of apps) {
            await applicationsApi.deleteApplication(app.id);
          }
        }
      } catch (err) {
        console.error('Fixture auto-cleanup failed:', err);
      }
    }
  },
  resumesApi: async ({ request }, use) => {
    const resumesApi = new ResumesApi(request);
    await use(resumesApi);
  },
  authenticatedUser: async ({ authApi, applicationsApi, resumesApi, loginPage }, use) => {
    const user = generateUserData();

    // Register user via API for fast setup
    const regRes = await authApi.register(user);
    if (regRes.status() !== 200) {
      throw new Error(`Failed to register dynamic user via API: ${await regRes.text()}`);
    }
    const regBody = await regRes.json();
    const token = regBody.token;

    // Authenticate API contexts
    authApi.setToken(token);
    applicationsApi.setToken(token);
    resumesApi.setToken(token);

    // Login via UI so browser session is authenticated
    await loginPage.navigateTo();
    await loginPage.loginUser(user.email, user.password);

    await use({ token, user });
  },
});

export { expect } from '@playwright/test';
