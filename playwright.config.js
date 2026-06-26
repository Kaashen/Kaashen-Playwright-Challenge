import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['monocart-reporter', {
      name: 'Playwright Test Report',
      outputFile: './monocart-report/index.html',
    }],
    ['list'],
    ...(process.env.CI ? [['github']] : []),
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testMatch: '**/tests/ui/**/*.tests.js',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        headless: true,
      },
    },
    {
      name: 'api',
      testMatch: '**/tests/api/**/*.tests.js',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
      },
      workers: 1,
    },
  ],
});