import { PlaywrightTestConfig, devices } from "@playwright/test";
import path from "path";

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  testDir: path.join(__dirname, "e2e"),
  outputDir: "test-results/",

  webServer: {
    command: "npm run dev",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
  },

  use: {
    trace: "retry-with-trace",
  },

  //   projects: [
  //     {
  //       name: "Desktop Edge",
  //       use: {
  //         ...devices["Desktop Edge"],
  //       },
  //     },
  //   ],
};
export default config;
