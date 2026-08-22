/**
 * Centralized Test Data Factory for the Aegis framework.
 * Provides consistent, isolated, and valid test data for UI and API tests.
 */

/**
 * Generates a unique email and associated user registration payload.
 */
export function generateUserData(overrides?: Record<string, string>) {
  const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  return {
    fullName: 'Aegis Visual Tester',
    email: `testuser+${uniqueId}@example.com`,
    password: 'TestPassword123!',
    ...overrides,
  };
}

/**
 * Generates a mock job application payload.
 */
export function generateJobApplicationData(profileId: string, overrides?: Record<string, unknown>) {
  const uniqueId = Date.now();
  return {
    companyName: `Aegis Corp ${uniqueId}`,
    roleTitle: 'Staff QA Engineer',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$150,000 - $180,000',
    meetingLink: 'https://zoom.us/interview-room',
    status: 'APPLIED',
    dateApplied: new Date().toISOString().slice(0, 10),
    profileId,
    ...overrides,
  };
}

/**
 * Generates resume metadata payload.
 */
export function generateResumeMetadata(overrides?: Record<string, string>) {
  return {
    changelog: `Aegis automated test upload - Version ${Date.now()}`,
    ...overrides,
  };
}

/**
 * Generates invalid credentials payload for negative authentication tests.
 */
export function generateInvalidCredentials() {
  return {
    email: 'nonexistent_api_user@example.com',
    password: 'WrongPassword123!',
  };
}
