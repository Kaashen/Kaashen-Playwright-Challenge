import { defineConfig, devices } from '@playwright/test';
import MCReport from 'monocart-reporter';

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
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testMatch: '**/tests/ui/**/*.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        headless: true,
      },
    },
    {
      name: 'api',
      testMatch: '**/tests/api/**/*.spec.js',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
      },
    },
  ],
});