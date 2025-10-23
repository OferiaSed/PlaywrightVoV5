import { defineConfig, devices } from '@playwright/test';
import { environments } from './config/environments';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
// Get environment from command line or default to 'qa'
const environment = process.env.ENVIRONMENT || 'qa1';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: environments[environment]?.baseUrl || environments.qa1.baseUrl,
    trace: 'on',
    actionTimeout: environments[environment]?.timeout || 30000,
    navigationTimeout: environments[environment]?.timeout || 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'qa1',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: environments.qa1.baseUrl,
        headless: environments.qa1.headless,
        viewport: { width: 1500, height:1000},
      },
    },

    {
      name: 'qa2',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: environments.qa2.baseUrl,
        headless: environments.qa2.headless,
        viewport: { width: 1500, height:1000},
      },
    },

    {
      name: 'preprod',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: environments.preprod.baseUrl,
        headless: environments.preprod.headless,
        viewport: { width: 1500, height:1000},
      },
    },

    {
      name: 'demo',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: environments.demo.baseUrl,
        headless: environments.demo.headless,
        viewport: { width: 1500, height:1000},
      },
    },
    
  ],
});
