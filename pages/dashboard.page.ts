import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * Page Object class representing dashboard operations, sidebar actions, and header controls.
 */
export class DashboardPage extends BasePage {
  // Navigation links in header
  readonly homeNavLink: Locator;
  readonly applicationsNavLink: Locator;
  readonly outreachNavLink: Locator;
  readonly resumesNavLink: Locator;

  // Sidebar Global Action buttons
  readonly addApplicationButton: Locator;
  readonly uploadResumeButton: Locator;

  // User menu controls in header
  readonly profileDropdownButton: Locator;

  constructor(page: Page) {
    super(page);

    // Nav links
    this.homeNavLink = page.locator('header nav').getByRole('link', { name: 'Home' });
    this.applicationsNavLink = page
      .locator('header nav')
      .getByRole('link', { name: 'Applications' });
    this.outreachNavLink = page.locator('header nav').getByRole('link', { name: 'Outreach' });
    this.resumesNavLink = page.locator('header nav').getByRole('link', { name: 'Resumes' });

    // Sidebar buttons
    this.addApplicationButton = page
      .locator('aside')
      .getByRole('button', { name: 'Add Application' });
    this.uploadResumeButton = page.locator('aside').getByRole('button', { name: 'Upload Resume' });

    // User profile menu button is the rounded-full button in the header
    this.profileDropdownButton = page.locator('header button.rounded-full');
  }

  /**
   * Opens the user menu dropdown and clicks logout.
   */
  async logout(): Promise<void> {
    await this.profileDropdownButton.click();

    // Find the logout button dynamically in the opened dropdown (supports button role or text match)
    const logoutBtn = this.page
      .getByRole('button', { name: /logout|sign\s*out/i })
      .or(this.page.getByText(/logout|sign\s*out/i))
      .first();

    await logoutBtn.click();
    await this.page.waitForURL('**/login');
  }
}
