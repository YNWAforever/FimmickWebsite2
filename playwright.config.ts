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
  // Chromium runs every spec; the other engines and the two Apple devices run the smoke set
  // (home, platform, services, contact, 404, video), award pass 2, Phase 9.
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: /smoke\.spec\.ts/ },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: /smoke\.spec\.ts/ },
    { name: "Mobile Safari", use: { ...devices["iPhone 14"] }, testMatch: /smoke\.spec\.ts/ },
    { name: "iPad landscape", use: { ...devices["iPad (gen 7) landscape"] }, testMatch: /smoke\.spec\.ts/ },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    // Locally an already-running build is reused; CI always starts the one it just built.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { ENQUIRY_FORWARD_URL: "" },
  },
});
