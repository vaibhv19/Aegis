import { test, expect } from '@playwright/test';

test.describe('Aegis Framework Smoke Tests', () => {
  test('verify target application is reachable', async ({ page, baseURL }) => {
    console.log(`Attempting to connect to target application at: ${baseURL}`);

    // Navigate to the base URL
    const response = await page.goto('/', { timeout: 15000 });

    // Verify response exists
    expect(response).not.toBeNull();

    // Assert response status is successful (2xx range)
    expect(response!.status()).toBeGreaterThanOrEqual(200);
    expect(response!.status()).toBeLessThan(400);

    // Verify page title is present
    const title = await page.title();
    console.log(`Target application page title: "${title}"`);
    expect(title).toBeTruthy();
  });
});
