import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ResumePage extends BasePage {
  // Page locators
  readonly uploadFirstResumeButton: Locator;

  // Modal upload form elements
  readonly fileInput: Locator;
  readonly changelogTextarea: Locator;
  readonly uploadSubmitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);

    // Page trigger button
    this.uploadFirstResumeButton = page.getByRole('button', { name: 'Upload First Resume' });

    // Modal elements
    this.fileInput = page.locator('input[type="file"]');
    this.changelogTextarea = page.getByPlaceholder(
      'e.g. Added new projects, updated technical skills section...'
    );
    this.uploadSubmitButton = page.getByRole('button', { name: 'Upload Resume' });
    this.cancelButton = page.locator('form').getByRole('button', { name: 'Cancel' });
  }

  /**
   * Navigates to the resumes list page.
   */
  async navigateToResumes(): Promise<void> {
    await this.navigate('/resumes');
    await this.waitForLoadState();
  }

  async openUploadModal(): Promise<void> {
    try {
      // Wait up to 5 seconds for the "Upload First Resume" button to be visible
      await this.uploadFirstResumeButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.uploadFirstResumeButton.click();
    } catch (e) {
      // If it's not visible (e.g. resumes already exist), click the header "Add" button and select Upload Resume
      await this.page.locator('header').getByRole('button', { name: 'Add' }).first().click();
      await this.page
        .getByRole('button', { name: 'Upload Resume' })
        .or(this.page.getByText('Upload Resume'))
        .first()
        .click();
    }
    await this.page.waitForSelector('form');
  }

  /**
   * Uploads a resume PDF file and saves it.
   */
  async uploadResumeFile(absoluteFilePath: string, changelogNotes: string): Promise<void> {
    // Set file input files (Playwright handles hidden inputs natively)
    await this.fileInput.setInputFiles(absoluteFilePath);

    // Fill changelog notes
    await this.changelogTextarea.fill(changelogNotes);

    // Click upload submit button
    await this.uploadSubmitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Gets selector for a resume version card in the version list.
   */
  getResumeCardLocator(filename: string): Locator {
    return this.page.locator(`text=${filename}`).first();
  }
}
