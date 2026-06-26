# Kaashen-Playwright-Challenge

Automated UI and API test framework using [Playwright](https://playwright.dev/), targeting:
- **UI**: [SauceDemo](https://www.saucedemo.com/)
- **API**: [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html)

## Test Coverage

**UI Tests (15)**
- Authentication: valid login, locked user, invalid credentials, logout
- Inventory: product count, sorting by price and name, item detail
- Cart: add/remove items, badge count, cart contents
- Checkout: complete flow, validation, cancel

**API Tests (8)**
- Auth: token generation, invalid credentials
- Booking CRUD: GET list, POST create, GET by ID, PUT update, PATCH partial update, DELETE

## Project Structure

```
Kaashen-Playwright-Challenge/
├── tests/
│   ├── ui/          # SauceDemo browser tests
│   └── api/         # Restful-Booker API tests
├── pages/           # Page Object Model classes
├── helpers/         # API helper + test data exports
├── test-data/       # JSON fixture files
└── playwright.config.js
```

## Setup

```bash
npm install
npx playwright install chromium
```

## Running Tests

```bash
# All tests
npm test

# UI tests only
npm run test:ui

# API tests only
npm run test:api
```

## Viewing Reports

```bash
# Playwright HTML report
npm run report

# Monocart report (open in browser)
start monocart-report/index.html
```

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions.
The HTML report is uploaded as a workflow artifact — downloadable from the Actions tab.

![CI](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions/workflows/ci.yml/badge.svg)