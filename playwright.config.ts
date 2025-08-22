import { defineConfig } from '@playwright/test';
import { getBaseUrl, getTimeout, getRetries } from './src/config/environment';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,  // Changed from true to false
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? getRetries() : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,  // Changed from undefined to 1
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never',
      attachmentsBaseURL: 'attachments/'
    }],
    ['json', { 
      outputFile: 'test-results/test-results.json' 
    }],
    ['list', { 
      printSteps: true 
    }],
    ['junit', { 
      outputFile: 'test-results/junit.xml' 
    }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: getBaseUrl(),

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* Global timeout for all actions */
    actionTimeout: getTimeout(),

    /* Collect screenshot on failure */
    screenshot: 'only-on-failure',

    /* Collect video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-tests',
      use: {
        // Minimal configuration for API testing - no browser needed
        baseURL: getBaseUrl(),
      },
    },
  ],

  /* Global test timeout */
  timeout: 60000,

  /* Output directory for test artifacts */
  outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
