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

- `tests/`: Project test files (smoke tests, functional E2E tests).
- `pages/`: Page Object models representing UI screens.
- `api/`: Programmatic API testing layer.
- `fixtures/`: Playwright test fixtures.
- `utils/`: Test helper utilities.
- `config/`: Configuration definitions.
- `test-data/`: Test payloads and files.
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
   BASE_URL=http://localhost:3000
   ```

## Required Trajectory Dependency

The framework requires an active target instance of the **Trajectory** application to verify reachability and run test suites.

Ensure the Trajectory application is started and listening at the URL matching the configured `BASE_URL` in `.env`. If the target application is not running or accessible, the smoke test will fail with a connection error.

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
