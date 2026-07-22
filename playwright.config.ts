import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const API_BASE_URL = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: UI_BASE_URL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        // Swag Labs exposes stable `data-test` attributes on nearly every
        // element; aligning Playwright's test-id convention to it lets page
        // objects use getByTestId() instead of brittle CSS/text selectors.
        testIdAttribute: 'data-test',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: API_BASE_URL,
      },
    },
  ],
});
