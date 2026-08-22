import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ApplicationPage extends BasePage {
  // Main form locators (using stable placeholders and labels)
  readonly companyInput: Locator;
  readonly roleInput: Locator;
  readonly personaSelect: Locator;
  readonly statusSelect: Locator;
  readonly locationInput: Locator;
  readonly salaryInput: Locator;
  readonly dateAppliedInput: Locator;
  readonly urlInput: Locator;
  readonly sourceInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  // Dynamic conditional fields
  readonly oaDateInput: Locator;
  readonly oaTestLinkInput: Locator;
  readonly interviewDateInput: Locator;
  readonly interviewMeetingLinkInput: Locator;

  constructor(page: Page) {
    super(page);

    // Initializing form elements
    this.companyInput = page.getByPlaceholder('e.g. Google');
    this.roleInput = page.getByPlaceholder('e.g. Software Engineer');

    // Select elements based on parent labels
    this.personaSelect = page.locator('div:has(> label:has-text("Career Persona")) select');
    this.statusSelect = page.locator('div:has(> label:has-text("Status")) select');

    this.locationInput = page.getByPlaceholder('e.g. London, UK (Hybrid)');
    this.salaryInput = page.getByPlaceholder('e.g. £50k - £60k');

    this.dateAppliedInput = page.locator('div:has(> label:has-text("Date Applied")) input');
    this.urlInput = page.getByPlaceholder('e.g. https://careers.google.com/...');
    this.sourceInput = page.getByPlaceholder('e.g. LinkedIn, Referral');
    this.descriptionTextarea = page.getByPlaceholder(
      'Paste the full job description details here...'
    );

    // Action buttons
    this.saveButton = page.getByRole('button', { name: 'Save Application' });
    this.cancelButton = page.locator('form').getByRole('button', { name: 'Cancel' });

    // Dynamic conditional locators (OA & Interview states)
    this.oaDateInput = page.locator('div:has(> label:has-text("OA Date & Time")) input');
    this.oaTestLinkInput = page.locator('div:has(> label:has-text("Meeting / Test Link")) input');
    this.interviewDateInput = page.locator(
      'div:has(> label:has-text("Interview Date & Time")) input'
    );
    this.interviewMeetingLinkInput = page.locator(
      'div:has(> label:has-text("Meeting Link")) input'
    );
  }

  /**
   * Navigates to the applications list page.
   */
  async navigateToApplicationsList(): Promise<void> {
    await this.navigate('/applications');
    await this.waitForLoadState();
  }

  /**
   * Fills in basic application details.
   */
  async fillBasicDetails(
    company: string,
    role: string,
    location: string,
    salary: string
  ): Promise<void> {
    await this.companyInput.fill(company);
    await this.roleInput.fill(role);
    await this.locationInput.fill(location);
    await this.salaryInput.fill(salary);
  }

  /**
   * Fills in additional application details.
   */
  async fillAdditionalDetails(url: string, source: string, description: string): Promise<void> {
    await this.urlInput.fill(url);
    await this.sourceInput.fill(source);
    await this.descriptionTextarea.fill(description);
  }

  /**
   * Selects a Career Persona option by value/index.
   */
  async selectPersona(personaValue: string): Promise<void> {
    // Select first available persona option if not matching custom values
    if (personaValue) {
      await this.personaSelect.selectOption({ label: personaValue });
    } else {
      await this.personaSelect.selectOption({ index: 1 });
    }
  }

  /**
   * Selects a Status option by value (e.g. APPLIED, OA, INTERVIEW, OFFER, REJECTED).
   */
  async selectStatus(statusValue: string): Promise<void> {
    await this.statusSelect.selectOption(statusValue);
  }

  /**
   * Fills in OA dynamic fields.
   */
  async fillOADetails(testLink: string): Promise<void> {
    await this.oaDateInput.fill(new Date().toISOString().slice(0, 16)); // Current date/time
    await this.oaTestLinkInput.fill(testLink);
  }

  /**
   * Fills in Interview dynamic fields.
   */
  async fillInterviewDetails(meetingLink: string): Promise<void> {
    await this.interviewDateInput.fill(new Date().toISOString().slice(0, 16));
    await this.interviewMeetingLinkInput.fill(meetingLink);
  }

  /**
   * Saves the job application form.
   */
  async saveApplication(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clicks on a job application card in the list.
   */
  async clickApplicationCard(companyName: string): Promise<void> {
    const card = this.page.locator(`text=${companyName}`).first();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteCurrentApplication(): Promise<void> {
    // Locate the delete button inside the opened modal/drawer
    const deleteBtn = this.page.getByRole('button', { name: 'Delete', exact: true });
    await deleteBtn.click();

    // Handle secondary confirm button if it appears
    const confirmDeleteBtn = this.page.getByRole('button', {
      name: 'Delete Application',
      exact: true,
    });
    if (await confirmDeleteBtn.isVisible()) {
      await confirmDeleteBtn.click();
    }

    await this.page.waitForLoadState('networkidle');
  }
}
