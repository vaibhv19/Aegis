# Aegis

[![Aegis CI Pipeline](https://github.com/vaibhv19/Aegis/workflows/Aegis%20CI%20Pipeline/badge.svg)](https://github.com/vaibhv19/Aegis/actions/workflows/ci.yml)

Aegis is an enterprise test automation framework and continuous integration pipeline targeting the Trajectory platform.

## Technology Stack

- **Language:** TypeScript
- **Test Runner:** Playwright
- **Reporting:** HTML & Allure Reports
- **Quality Tooling:** ESLint & Prettier
- **Target App:** Trajectory

## Project Structure

Aegis is organized under a modular directory layout:

- `tests/`: Project test files categorized by suite type (smoke, framework, E2E, API, visual, etc.).
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
- Docker (for containerized execution)

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

### Visual Regression Layer

Visual regression testing utilizes Playwright's native screenshot comparison to verify visual stability:

- **Configured Comparators**: Disables active animations and transitions (`animations: 'disabled'`), configures custom subpixel tolerance (`maxDiffPixels: 50`), and hides the blinking text insertion cursor (`caret: 'hide'`) to ensure visual determinism.
- **Cross-Browser Visual Strategy**: Runs visual validations against Chromium, Firefox, and WebKit to capture rendering characteristics per browser engine.
- **Dynamic Content Handling**: Uses bounding box masking to hide dynamic dates and profile elements from snapshot assertions.

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

### CI/CD Pipeline & Quality Gates

Aegis implements an automated CI/CD pipeline on GitHub Actions to continuously verify the repository:

- **Runner Configuration:** Executes inside Node.js 20 on an `ubuntu-latest` Linux runner.
- **Package Integrity:** Standardizes clean dependency installs using `npm ci` with caching of the npm global store via `actions/setup-node`.
- **Quality Gates:** Enforcement flows sequentially: Lint (`eslint .`) $\rightarrow$ Format Verification (`prettier --check .`) $\rightarrow$ Playwright Sequential Test Run (`npx playwright test --workers=1`).
- **Failures & Artifacts:** If a run fails, the Playwright HTML test report, execution traces, and Allure results are uploaded as artifacts and stored for **14 days**.

#### Visual Baseline Platform Strategy

Because layout, font-anti-aliasing, and visual scrollbars differ between operating systems, local developers and CI runners require platform-specific baseline screenshots:

- **Windows baselines** are saved with the suffix `-win32.png` and are preserved for local Windows execution.
- **Linux/Ubuntu baselines** are saved with the suffix `-linux.png`.
- The CI pipeline remains **read-only** and validates visual correctness without automatically updating repository baselines.

#### Known Expected Backend Defect

The Trajectory backend contains an authentication exception defect:

- **Defect:** Submitting invalid login credentials returns `500 Internal Server Error` instead of the standard `401 Unauthorized`.
- **CI/CD Mitigation:** Rather than weakening the strict validation (`expect(response.status()).toBe(401)`), this test is annotated with Playwright's native `test.fail(true, 'Trajectory backend defect')` in `tests/api/auth.spec.ts`. This narrowly isolates the failure, allowing the test to run as an "expected failure" (marking the pipeline green). If the backend is fixed, the test will unexpectedly pass, alerting developers to remove the annotation.

### Test Categorization & Tagging

Tests are tagged to support selective category execution:

- **Smoke Tests (`@smoke`):** General system sanity validations.
- **Framework Tests (`@framework`):** Page Object Model and configuration validations.
- **E2E UI Tests (`@e2e`):** Multi-page functional user workflows.
- **API Tests (`@api`):** Backend verification, contract, and response checks.
- **Visual Tests (`@visual`):** Cross-browser visual comparisons.

## Available Scripts

Run the following commands to check linting, formatting, and execute tests:

### Running Tests

- **Run all headless tests (smoke, framework, E2E, API, and visual):**
  ```bash
  npm run test
  ```
- **Run tests in headed mode:**
  ```bash
  npm run test:headed
  ```

#### Targeted Test Categories

- **Run smoke tests only:**
  ```bash
  npm run test:smoke
  ```
- **Run E2E UI tests only:**
  ```bash
  npm run test:e2e
  ```
- **Run API verification tests only:**
  ```bash
  npm run test:api
  ```
- **Run visual regression tests only:**
  ```bash
  npm run test:visual
  ```

### Reporting & Diagnostics

We support native Playwright HTML reporting and integrated Allure Reports:

- **Playwright HTML Report:** Generated to `playwright-report/` after each run. To view it:
  ```bash
  npx playwright show-report
  ```
- **Generate Allure Report:** Compiles raw test outputs in `allure-results/` into a human-readable layout in `allure-report/`:
  ```bash
  npm run allure:generate
  ```
- **Open Allure Report:** Launches a local web server to display the report:
  ```bash
  npm run allure:open
  ```
- **Clear Allure Results:** Removes generated Allure assets:
  ```bash
  npm run allure:clear
  ```

#### Failure Diagnostics

To minimize execution overhead, failure-focused diagnostics are collected:

- **Screenshots:** Taken automatically only on failed test steps (`screenshot: 'only-on-failure'`).
- **Traces:** Recorded only when a test is retried after a failure (`trace: 'on-first-retry'`).
- **Videos:** Captured only when a test is retried after a failure (`video: 'on-first-retry'`).

### Containerization (Docker)

To isolate dependencies and ensure reproducible execution across different development machines:

#### Build Docker Image

Build the test execution image locally:

```bash
docker build -t aegis-test .
```

#### Run Test Suite

- **Run the full regression test suite (default behavior):**
  ```bash
  docker run --rm aegis-test
  ```
- **Run targeted categories:**
  ```bash
  docker run --rm aegis-test npm run test:smoke
  docker run --rm aegis-test npm run test:api
  ```
- **Run with environment overrides:**
  ```bash
  docker run --rm -e BASE_URL=https://trajectory-mu-six.vercel.app -e API_BASE_URL=https://trajectory-api.duckdns.org aegis-test
  ```

#### Report & Artifact Persistence

Since container filesystems are ephemeral, use volume bind mounts to persist Playwright HTML reports, execution traces, and Allure results directly to your host machine:

- **PowerShell / Linux:**
  ```bash
  docker run --rm `
    -v ${PWD}/playwright-report:/app/playwright-report `
    -v ${PWD}/test-results:/app/test-results `
    -v ${PWD}/allure-results:/app/allure-results `
    aegis-test
  ```
- **Windows Command Prompt (CMD):**
  ```cmd
  docker run --rm ^
    -v %cd%/playwright-report:/app/playwright-report ^
    -v %cd%/test-results:/app/test-results ^
    -v %cd%/allure-results:/app/allure-results ^
    aegis-test
  ```

### Test Data & Teardown Lifecycle

Aegis uses a centralized, deterministic, and isolated approach to test data and environment cleanliness:

- **Centralized Test Data Factory ([`test-data.factory.ts`](file:///d:/Coding/Projects----Testing/Aegis/utils/test-data.factory.ts)):** Centralizes the creation of all mock payloads for users, job applications, resumes, and negative authentication scenarios.
- **Identity Isolation & Baseline Preservation:** Generated users use dynamic, unique emails (combining timestamps and random values) to avoid cross-run collisions. They use the default full name `'Aegis Visual Tester'` to remain compatible with existing visual baselines.
- **Auto-Cleanup Teardown Hook:** The custom `applicationsApi` fixture intercepts test completions and automatically deletes all job applications created under the authenticated user. This teardown is resilient to test assertion failures because it runs in Playwright's fixture teardown block.
- **Reusable `authenticatedUser` Fixture:** Encapsulates fast API-based registration, API client authentication (injecting Bearer tokens to `applicationsApi` and `resumesApi`), and UI-based login. This reduces setup boilerplate across E2E and visual tests.
- **Hydration Settling:** Reusable login/registration UI actions await the `'networkidle'` load state to guarantee the frontend is fully hydrated and ready for click events, preventing interaction flakes in headless webkit runners.

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
