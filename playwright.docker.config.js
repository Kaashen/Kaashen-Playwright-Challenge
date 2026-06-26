import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/tests/ui/visual.tests.js',
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'https://www.saucedemo.com',
    headless: true,
  },
  projects: [
    {
      name: 'ui',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
