# Kaashen-Playwright-Challenge

Automated UI and API test framework using [Playwright](https://playwright.dev/), targeting:

- **UI**: [SauceDemo](https://www.saucedemo.com/)
- **API**: [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html)

[![CI](https://github.com/Kaashen/Kaashen-Playwright-Challenge/actions/workflows/ci.yml/badge.svg)](https://github.com/Kaashen/Kaashen-Playwright-Challenge/actions/workflows/ci.yml)

---

## Repository Flow

```mermaid
flowchart TD
    A[Developer pushes code] --> B{GitHub Actions CI}

    B --> C[Job: UI Tests]
    B --> D[Job: API Tests]

    C --> C1[Checkout code]
    C1 --> C2[Install Node + dependencies]
    C2 --> C3[Install Chromium browser]
    C3 --> C4[npm run test:ui]
    C4 --> C5[playwright.config.js\nproject: ui\ntestMatch: tests/ui/**]
    C5 --> C6{Tests pass?}
    C6 -->|Yes| C7[Upload UI Reports]
    C6 -->|No| C7

    D --> D1[Checkout code]
    D1 --> D2[Install Node + dependencies]
    D2 --> D3[Install Chromium browser]
    D3 --> D4[npm run test:api]
    D4 --> D5[playwright.config.js\nproject: api\ntestMatch: tests/api/**]
    D5 --> D6{Tests pass?}
    D6 -->|No| D6a[Generate + commit snapshots]
    D6 -->|Yes| D7[Upload API Reports]
    D6a --> D7

    C7 --> E[Job: Notify]
    D7 --> E
    E --> E1[Download all artifacts]
    E1 --> E2[Send email with\n4 report attachments]

    subgraph Reports
        C7 --> R1[playwright-report-ui]
        C7 --> R2[monocart-report-ui]
        D7 --> R3[playwright-report-api]
        D7 --> R4[monocart-report-api]
    end
```

---

## Project Structure

```
Kaashen-Playwright-Challenge/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline
├── helpers/
│   ├── apiHelper.js                # ApiHelper class (CRUD wrappers)
│   └── testData.js                 # Shared credentials and fixtures
├── pages/                          # Page Object Model (UI only)
├── test-data/                      # JSON fixture files
├── tests/
│   ├── ui/                         # SauceDemo browser tests
│   │   ├── auth.spec.js
│   │   ├── inventory.spec.js
│   │   ├── cart.spec.js
│   │   └── checkout.spec.js
│   └── api/                        # Restful-Booker API tests
│       ├── 01-health.spec.js
│       ├── 02-auth.spec.js
│       └── 03-booking.spec.js
├── playwright.config.js            # Main config (UI + API projects)
├── playwright.docker.config.js     # Docker config (snapshot generation)
├── docker-compose.yml              # Docker runner
└── package.json
```

---

## Test Types

Both UI and API tests share the same capabilities: **snapshot assertions** for regression detection and **Docker support** for generating Linux-compatible snapshots that match CI.

### UI Tests — SauceDemo

Browser-based end-to-end tests using the `Desktop Chrome` device profile against `https://www.saucedemo.com`. Uses the **Page Object Model** pattern — each page has a corresponding class in `pages/`. UI tests use `toMatchSnapshot()` to lock in screenshots and state at key points, and Docker is used to generate the `*-linux.json` snapshot baselines that CI compares against.

| File | Suite | Tests |
|------|-------|-------|
| `auth.spec.js` | Authentication | Valid login, locked user, invalid credentials, logout |
| `inventory.spec.js` | Inventory | Product count, sort by price, sort by name, item detail |
| `cart.spec.js` | Cart | Add/remove items, badge count, cart contents |
| `checkout.spec.js` | Checkout | Complete flow, field validation, cancel |

### API Tests — Restful-Booker

Headless API tests using Playwright's built-in `request` context against `https://restful-booker.herokuapp.com`. Uses the **ApiHelper** class in `helpers/apiHelper.js` to wrap all HTTP calls. Like UI tests, all API tests use `toMatchSnapshot()` to snapshot response shapes as `*-linux.json` files for regression detection, and Docker is used to generate those baselines.

| File | Suite | Tests |
|------|-------|-------|
| `01-health.spec.js` | Health Check | GET /ping returns 201 |
| `02-auth.spec.js` | Authentication | Valid token, invalid credentials, empty credentials, missing field |
| `03-booking.spec.js` | Booking CRUD | GET list, filter by name, filter by dates, POST create, schema validation, GET by ID, invalid ID, PUT update, PUT without auth, PATCH partial update, DELETE without auth, DELETE and verify |

---

## Setup

### Prerequisites

Install the following before cloning:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v24 | [nodejs.org](https://nodejs.org) |
| Git | latest | [git-scm.com](https://git-scm.com) |
| Docker Desktop | latest | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) — required for snapshot generation |

### First-time setup

**1. Clone the repo**
```bash
git clone https://github.com/Kaashen/Kaashen-Playwright-Challenge.git
cd Kaashen-Playwright-Challenge
```

**2. Install dependencies**
```bash
npm install
```

**3. Install Playwright browsers**
```bash
npx playwright install chromium
```

**4. Run all tests**
```bash
npm test
```

No `.env` files, credentials, or API keys are required — both SauceDemo and Restful-Booker are public APIs.

### Snapshot setup (required before pushing new tests)

Snapshots must be generated inside a Linux Docker container to match the CI environment. Run once after cloning, and again whenever you add a new `toMatchSnapshot()` assertion.

**Windows (PowerShell):**
```powershell
docker run --rm -v "${PWD}:/work" -w /work mcr.microsoft.com/playwright:v1.61.0-noble `
  npx playwright test --update-snapshots
```

**Mac/Linux:**
```bash
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.61.0-noble \
  npx playwright test --update-snapshots
```

Or via docker-compose:
```bash
docker-compose up
```

Then commit the generated `*-linux.json` snapshot files:
```bash
git add tests/
git commit -m "Update snapshots"
git push
```

---

## Running Tests

### All tests

```bash
npm test
```

### UI tests only

```bash
npm run test:ui
```

### API tests only

```bash
npm run test:api
```

### One specific test file

```bash
npx playwright test tests/api/02-auth.spec.js
npx playwright test tests/ui/auth.spec.js
```

### One specific test by name

```bash
npx playwright test --grep "valid credentials return a token"
```

### With headed browser (UI tests)

```bash
npx playwright test --project=ui --headed
```

### Update snapshots (after adding new snapshot assertions)

```bash
# API tests only
npx playwright test tests/api/ --update-snapshots

# UI tests only
npx playwright test tests/ui/ --update-snapshots

# All tests
npx playwright test --update-snapshots
```

> **Note:** Running `--update-snapshots` locally on Windows/Mac generates `*-win32.json` / `*-darwin.json` files. CI requires `*-linux.json`. Use Docker (see below) to generate the correct baseline files.

---

## Docker Tests

Docker runs tests inside a Linux container matching the CI environment — required for generating `*-linux.json` snapshots that CI uses for comparison. This applies equally to both UI and API tests.

### Run via docker-compose (snapshot generation)

```bash
docker-compose up
```

This runs `playwright.docker.config.js` with `--update-snapshots`, writing Linux-compatible snapshot files to `tests/**-snapshots/`.

### Run specific tests in Docker (PowerShell)

```powershell
# All API tests + update snapshots
docker run --rm -v "${PWD}:/work" -w /work mcr.microsoft.com/playwright:v1.61.0-noble `
  npx playwright test tests/api/ --update-snapshots

# All UI tests + update snapshots
docker run --rm -v "${PWD}:/work" -w /work mcr.microsoft.com/playwright:v1.61.0-noble `
  npx playwright test tests/ui/ --update-snapshots

# All tests + update snapshots
docker run --rm -v "${PWD}:/work" -w /work mcr.microsoft.com/playwright:v1.61.0-noble `
  npx playwright test --update-snapshots
```

### Run specific tests in Docker (bash/Mac/Linux)

```bash
# All API tests + update snapshots
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.61.0-noble \
  npx playwright test tests/api/ --update-snapshots

# All UI tests + update snapshots
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.61.0-noble \
  npx playwright test tests/ui/ --update-snapshots

# All tests + update snapshots
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.61.0-noble \
  npx playwright test --update-snapshots
```

### Normal Playwright vs Docker — when to use which

| | Normal (`npx playwright test`) | Docker |
|---|---|---|
| **When to use** | Local development and debugging | Generating Linux snapshots for CI |
| **Snapshot files** | `*-win32.json` / `*-darwin.json` | `*-linux.json` ✅ matches CI |
| **Speed** | Fast | Slower (container startup) |
| **Headed mode** | Supported | Not supported |
| **Config** | `playwright.config.js` | `playwright.docker.config.js` |

---

## Adding a Test

Both UI and API tests follow the same pattern: write the test, add a `toMatchSnapshot()` assertion, generate the Linux baseline with Docker, then commit the snapshot files.

### Adding a UI test

1. Create or open a spec file in `tests/ui/`
2. Import the relevant page object from `pages/`
3. Write your test with a snapshot assertion:

```js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';

test.describe('My new suite', () => {
  test('does something', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
    expect(JSON.stringify({ loggedIn: true }))
      .toMatchSnapshot('my-ui-snapshot.json');
  });
});
```

4. Generate the Linux snapshot before pushing:

```powershell
docker run --rm -v "${PWD}:/work" -w /work mcr.microsoft.com/playwright:v1.61.0-noble `
  npx playwright test tests/ui/my-new-spec.spec.js --update-snapshots
```

Then commit the generated `tests/ui/*.spec.js-snapshots/*-linux.json` files.

### Adding an API test

1. Create or open a spec file in `tests/api/`
2. Import `ApiHelper` and test data from `helpers/`
3. Write your test with a snapshot assertion:

```js
import { test, expect } from '@playwright/test';
import { auth } from '../../helpers/testData.js';
import { ApiHelper } from '../../helpers/apiHelper.js';

test.describe('My API suite', () => {
  test('GET /booking returns 200', async ({ request }) => {
    const api = new ApiHelper(request);
    const response = await api.getBookings();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(JSON.stringify({ isArray: Array.isArray(body) }))
      .toMatchSnapshot('my-api-snapshot.json');
  });
});
```

4. Generate the Linux snapshot before pushing:

```powershell
docker run --rm -v "${PWD}:/work" -w /work mcr.microsoft.com/playwright:v1.61.0-noble `
  npx playwright test tests/api/my-new-spec.spec.js --update-snapshots
```

Then commit the generated `tests/api/*.spec.js-snapshots/*-linux.json` files.

---

## Viewing Reports

```bash
# Playwright HTML report (opens in browser)
npm run report

# Monocart report (Windows)
npm run report:monocart
```

Reports are also emailed automatically after every CI run with all four reports attached (UI + API, Playwright + Monocart).

---

## CI/CD

Tests run automatically on every push and pull request to `main` via GitHub Actions (`.github/workflows/ci.yml`).

The pipeline runs UI and API jobs in parallel, then a `notify` job sends a combined email with all four report files attached.

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `MAIL_USERNAME` | Gmail address used to send reports |
| `MAIL_PASSWORD` | Gmail App Password (not your login password) |
| `MAIL_TO` | Recipient email address |