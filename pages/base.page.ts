import { Page } from '@playwright/test';

/**
 * Foundational Page Object class providing generic utilities.
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a path relative to the base URL
   */
  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Helper to wait for the DOM content load state
   */
  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Gets the current page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
