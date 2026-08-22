import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

/**
 * Page Object class representing interactions on the Trajectory LoginPage.
 */
export class LoginPage extends BasePage {
  // Tabs
  readonly signInTabButton: Locator;
  readonly signUpTabButton: Locator;

  // Sign In Form Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInSubmitButton: Locator;

  // Sign Up Form Locators
  readonly fullNameInput: Locator;
  readonly signUpSubmitButton: Locator;

  constructor(page: Page) {
    super(page);

    // Tabs
    this.signInTabButton = page.getByRole('button', { name: 'Sign In', exact: true }).first();
    this.signUpTabButton = page.getByRole('button', { name: 'Sign Up', exact: true }).first();

    // Inputs
    this.emailInput = page.getByPlaceholder('name@company.com');
    this.passwordInput = page.getByPlaceholder('••••••••');
    this.fullNameInput = page.getByPlaceholder('e.g. Jane Doe');

    // Submit buttons scoped to forms
    this.signInSubmitButton = page
      .locator('form')
      .getByRole('button', { name: 'Sign In', exact: true });
    this.signUpSubmitButton = page
      .locator('form')
      .getByRole('button', { name: 'Sign Up', exact: true });
  }

  /**
   * Navigates to the login page (root url redirects to login if unauthenticated)
   */
  async navigateTo(): Promise<void> {
    await this.navigate('/');
  }

  /**
   * Switches to the Sign Up tab
   */
  async switchToSignUp(): Promise<void> {
    await this.signUpTabButton.click();
  }

  /**
   * Switches to the Sign In tab
   */
  async switchToSignIn(): Promise<void> {
    await this.signInTabButton.click();
  }

  /**
   * Fills sign in credentials (does not submit)
   */
  async fillSignInCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Submits the sign in form
   */
  async submitSignIn(): Promise<void> {
    await this.signInSubmitButton.click();
  }

  /**
   * Registers a new user account via the UI and waits for redirect to dashboard
   */
  async registerNewUser(fullName: string, email: string, password: string): Promise<void> {
    await this.switchToSignUp();
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signUpSubmitButton.click();
    await this.page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Logs in a user via the UI and waits for redirect to dashboard
   */
  async loginUser(email: string, password: string): Promise<void> {
    await this.switchToSignIn();
    await this.fillSignInCredentials(email, password);
    await this.submitSignIn();
    await this.page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
  }
}
