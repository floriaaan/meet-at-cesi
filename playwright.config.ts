import { PlaywrightTestConfig, devices } from "@playwright/test";
import path from "path";

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  testDir: path.join(__dirname, "e2e"),
  outputDir: "test-results/",

  webServer: {
    command: "npm run dev",
    port: 3000,
    timeout: 30 * 1000,
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
  },

  workers: !process.env.CI ? 5 : undefined,
  retries: !process.env.CI ? 1 : undefined,

  use: {
    trace: "retry-with-trace",
  },

  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Desktop Safari",
      use: {
        ...devices["Desktop Safari"],
      },
    },
    {
      name: "Pixel 5",
      use: {
        ...devices["Pixel 5"],
      },
    },
    {
      name: "Galaxy S9+",
      use: {
        ...devices["Galaxy S9+"],
      },
    },

    // **NOTE**: This is a temporary workaround for a Playwright non supported devices in Github Actions.
    // {
    //   name: "iPhone 13 Pro",
    //   use: {
    //     ...devices["iPhone 13 Pro"],
    //   },
    // },
    // {
    //   name: "iPhone 13 Mini",
    //   use: {
    //     ...devices["iPhone 13 Mini"],
    //   },
    // },
  ],
};
export default config;
