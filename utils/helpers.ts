/**
 * Reusable utility helpers for the Aegis framework.
 */

let emailCounter = 0;

/**
 * Generates a unique email address with a timestamp and counter for isolated test execution.
 */
export function generateUniqueEmail(baseEmail: string = 'testuser'): string {
  const timestamp = Date.now();
  emailCounter++;
  return `${baseEmail}+${timestamp}${emailCounter}@example.com`;
}

/**
 * Utility helper to sleep/delay execution.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
