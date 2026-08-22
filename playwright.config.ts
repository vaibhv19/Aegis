import { defineConfig, devices } from '@playwright/test';
import { config } from './config/env.js';

/**
 * Central Playwright configuration for Aegis.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright', { detail: true, outputFolder: 'allure-results', suiteTitle: false }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: config.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video recording settings */
    video: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Timeout settings */
  timeout: 60000, // 60 seconds global test timeout
  expect: {
    timeout: 5000, // 5 seconds assertion timeout
    toHaveScreenshot: {
      maxDiffPixels: 50, // subpixel tolerance for dynamic rendering artifacts
      threshold: 0.2, // color match difference sensitivity
      animations: 'disabled', // automatically disable active CSS transitions/animations
      timeout: 20000, // 20 seconds timeout specifically for slow visual assertions (e.g. WebKit)
      caret: 'hide', // automatically hide blinking text caret/cursor in screenshots
    },
  },
});
