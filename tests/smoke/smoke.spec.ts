import { test, expect } from '@playwright/test';

test.describe('Aegis Framework Smoke Tests', () => {
  test('verify target application is reachable', { tag: '@smoke' }, async ({ page, baseURL }) => {
    console.log(`Attempting to connect to target application at: ${baseURL}`);

    // Navigate to the base URL
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify response exists
    expect(response).not.toBeNull();

    // Assert response status is successful (2xx range)
    expect(response!.status()).toBeGreaterThanOrEqual(200);
    expect(response!.status()).toBeLessThan(400);

    // Verify page title matches "Trajectory"
    const title = await page.title();
    console.log(`Target application page title: "${title}"`);
    expect(title).toBe('Trajectory');
  });
});
