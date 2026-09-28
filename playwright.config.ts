import { defineConfig, devices } from "@playwright/test";

/**
 * Browser regression checks against the production build.
 * Run `npm run build` first; the server below starts `next start` in review
 * mode (SITE_ENV unset → noindex). No enquiry forwarder is configured, so no
 * real message can be sent during tests.
 */
const PORT = Number(process.env.E2E_PORT || 3100);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: true,
    timeout: 120_000,
    env: { ENQUIRY_FORWARD_URL: "" },
  },
});
