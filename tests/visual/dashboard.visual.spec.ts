import { test, expect } from '../../fixtures/test.fixture.js';

test.describe('Aegis Dashboard Visual Regression Tests', () => {
  test(
    'should match dashboard visual layout for a fresh user',
    { tag: '@visual' },
    async ({ authenticatedUser, page }) => {
      console.log(`Running dashboard visual test as: ${authenticatedUser.user.email}`);

      // Mask the welcome greeting (which contains dynamic name) and profile menu button
      await expect(page).toHaveScreenshot('dashboard-empty-view.png', {
        mask: [
          page.getByRole('heading', { name: /Welcome/i }),
          page.locator('header button.rounded-full'),
        ],
        maxDiffPixels: 15000,
      });
    }
  );
});
