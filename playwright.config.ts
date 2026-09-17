import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4175/notion-avatar-generator/",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bun run preview --host 127.0.0.1 --port 4175 --strictPort",
    url: "http://127.0.0.1:4175/notion-avatar-generator/",
    reuseExistingServer: !process.env.CI,
  },
});
