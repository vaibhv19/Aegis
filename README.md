# Aegis

Aegis is an enterprise test automation framework and continuous integration pipeline targeting the Trajectory platform.

## Technology Stack

- **Language:** TypeScript
- **Test Runner:** Playwright
- **Reporting:** HTML Reports
- **Quality Tooling:** ESLint & Prettier
- **Target App:** Trajectory

## Project Structure

Aegis is organized under a modular directory layout:

- `tests/`: Project test files categorized by suite type (smoke, framework, E2E, API, etc.).
- `pages/`: Page Object models representing UI screens (e.g. `base.page.ts`, `login.page.ts`, `dashboard.page.ts`, `application.page.ts`, `resume.page.ts`).
- `api/`: Programmatic API client verification layer (e.g. `base.api.ts`, `auth.api.ts`, `applications.api.ts`, `resumes.api.ts`).
- `fixtures/`: Playwright custom test fixtures (`test.fixture.ts`).
- `utils/`: Test helper utilities (`helpers.ts`).
- `config/`: Configuration definitions (`env.ts`).
- `test-data/`: Test payloads and files (e.g., `users.json`, `sample-resume.pdf`).
- `.github/workflows/`: CI pipeline configurations.
- `docker/`: Isolation and containers environment setup.
- `docs/`: Framework documentation.

## Prerequisites

Ensure you have the following installed on your system:

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- Git

## Installation

1. Clone the Aegis repository.
2. Navigate to the project root directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Install required Playwright browser binaries:
   ```bash
   npx playwright install
   ```

## Environment Setup

1. Copy the environment variables example file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set the `BASE_URL` and `API_BASE_URL` to match your target Trajectory application deployment URL and backend service URL:
   ```env
   BASE_URL=https://trajectory-mu-six.vercel.app
   API_BASE_URL=https://trajectory-api.duckdns.org

   # (Optional) Reusable static test user credentials
   TEST_USER_EMAIL=your-static-user@example.com
   TEST_USER_PASSWORD=your-static-password
   ```

## Architecture Design

### Page Object Model

Page Objects represent application page surfaces and encapsulate DOM locators and application actions.

- `BasePage` ([`base.page.ts`](pages/base.page.ts)): Abstract class providing common actions (navigation, load state checks).
- `LoginPage` ([`login.page.ts`](pages/login.page.ts)): Extends base page, encapsulates sign-in/sign-up forms, input inputs, and tab switches.
- `DashboardPage` ([`dashboard.page.ts`](pages/dashboard.page.ts)): Extends base page, encapsulates main navigation tabs, global sidebar buttons, and profile menu logout.
- `ApplicationPage` ([`application.page.ts`](pages/application.page.ts)): Extends base page, encapsulates modal form fields, dynamic OA/Interview conditional elements, and job detail drawer deletion.
- `ResumePage` ([`resume.page.ts`](pages/resume.page.ts)): Extends base page, encapsulates drag & drop file upload input, changelog text area, and versions matrix representation.

### API Client Layer

API clients encapsulate backend API interactions, request payload construction, endpoint structures, and reusable operations:

- `BaseApi` ([`base.api.ts`](api/base.api.ts)): Shared API client wrapping Playwright's `APIRequestContext` and providing standard HTTP verbs, multipart upload handlers, and Bearer token headers initialization.
- `AuthApi` ([`auth.api.ts`](api/auth.api.ts)): Extends base API client, manages register, login, and user profile endpoints.
- `ApplicationsApi` ([`applications.api.ts`](api/applications.api.ts)): Extends base API client, manages applications CRUD and career profiles retrieval.
- `ResumesApi` ([`resumes.api.ts`](api/resumes.api.ts)): Extends base API client, manages versioned resumes uploads (as multipart) and list retrievals.

### Selector Strategy

To ensure test stability, the framework targets elements in order of priority:

1. Playwright built-in accessible role locators (`page.getByRole`)
2. Placeholder values (`page.getByPlaceholder`)
3. Accessible labels (`page.getByLabel`)
4. Explicit test attributes (`data-testid`)
5. Stable semantic text contents or stable scoped CSS elements

### Custom Fixtures

We use Playwright's fixture system ([`test.fixture.ts`](fixtures/test.fixture.ts)) to inject page objects and API clients directly into test parameters.

```typescript
import { test, expect } from '../../fixtures/test.fixture.js';

test('example test', async ({ loginPage, dashboardPage }) => {
  await loginPage.navigateTo();
  await loginPage.fillSignInCredentials('user@example.com', 'pass');
  await loginPage.submitSignIn();
  await expect(dashboardPage.addApplicationButton).toBeVisible();
});
```

### Test Categorization

We support organizing tests by directory structure and naming conventions:

- **Smoke Tests:** Located in `tests/smoke/` for fast sanity checks.
- **Framework Tests:** Located in `tests/framework/` to verify framework layers and custom utilities.
- **E2E Tests:** Located in `tests/e2e/` (e.g. `auth.spec.ts`, `application-lifecycle.spec.ts`, `resume-management.spec.ts`) for user workflow automation.
- **API Tests:** Located in `tests/api/` (e.g. `auth.spec.ts`, `applications.spec.ts`, `resumes.spec.ts`) for backend verification, response contract checking, and performance testing.

## Available Scripts

Run the following commands to check linting, formatting, and execute tests:

### Running Tests

- **Run all headless tests (smoke, framework, E2E, and API):**
  ```bash
  npm run test
  ```
- **Run tests in headed mode:**
  ```bash
  npm run test:headed
  ```
- **Run targeted UI E2E tests specifically:**
  ```bash
  npx playwright test tests/e2e
  ```
- **Run targeted API E2E tests specifically:**
  ```bash
  npx playwright test tests/api
  ```

### Code Quality

- **Run ESLint checks:**
  ```bash
  npm run lint
  ```
- **Run Prettier formatting checks:**
  ```bash
  npm run format:check
  ```
- **Automatically fix lint issues:**
  ```bash
  npm run lint:fix
  ```
- **Automatically format files:**
  ```bash
  npm run format:write
  ```
