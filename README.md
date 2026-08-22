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

- `tests/`: Project test files categorized by suite type (smoke, framework, etc.).
- `pages/`: Page Object models representing UI screens (e.g. `base.page.ts`, `login.page.ts`).
- `api/`: Programmatic API testing layer.
- `fixtures/`: Playwright custom test fixtures (`test.fixture.ts`).
- `utils/`: Test helper utilities (`helpers.ts`).
- `config/`: Configuration definitions (`env.ts`).
- `test-data/`: Test payloads and files (e.g., `users.json`).
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
2. Open `.env` and set the `BASE_URL` to match your target Trajectory application deployment URL:
   ```env
   BASE_URL=https://trajectory-mu-six.vercel.app
   ```

## Architecture Design

### Page Object Model

Page Objects represent application page surfaces and encapsulate DOM locators and application actions.

- `BasePage` ([`base.page.ts`](pages/base.page.ts)): Abstract class providing common actions (navigation, load state checks).
- `LoginPage` ([`login.page.ts`](pages/login.page.ts)): Extends base page, encapsulates elements (email, password inputs, tab elements, submit buttons) and form actions.

### Selector Strategy

To ensure test stability, the framework targets elements in order of priority:

1. Playwright built-in accessible role locators (`page.getByRole`)
2. Placeholder values (`page.getByPlaceholder`)
3. Accessible labels (`page.getByLabel`)
4. Explicit test attributes (`data-testid`)
5. Stable semantic text contents or stable scoped CSS elements

### Custom Fixtures

We use Playwright's fixture system ([`test.fixture.ts`](fixtures/test.fixture.ts)) to inject page objects directly into test parameters.

```typescript
import { test, expect } from '../../fixtures/test.fixture.js';

test('example test', async ({ loginPage }) => {
  await loginPage.navigateTo();
  await expect(loginPage.signInSubmitButton).toBeVisible();
});
```

### Test Categorization

We support organizing tests by directory structure and naming conventions:

- **Smoke Tests:** Located in `tests/smoke/` for fast sanity checks.
- **Framework Tests:** Located in `tests/framework/` to verify framework layers and custom utilities.
- **E2E / Regression / API / Visual:** Reserved directories under `tests/` for future execution scopes.

## Available Scripts

Run the following commands to check linting, formatting, and execute tests:

### Running Tests

- **Run all headless tests:**
  ```bash
  npm run test
  ```
- **Run tests in headed mode:**
  ```bash
  npm run test:headed
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
