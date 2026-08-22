import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';

type AegisFixtures = {
  loginPage: LoginPage;
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
});

export { expect } from '@playwright/test';
