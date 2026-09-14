import {defineConfig, devices} from '@playwright/test'

// The suite runs against the built Nitro server (`bun run build`), so the
// language-entry redirect, the locale cookie and the server-rendered HTML are
// exercised the same way they are in production. Chromium is the reference
// engine; Firefox/WebKit are checked manually before a release.
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI
        ? 2
        : 1,
    // Run sequentially so the intentionally stateful language/cookie checks
    // stay deterministic.
    workers: 1,
    reporter: [['list'], ['html', {open: 'never'}]],
    timeout: 30_000,
    expect: {timeout: 5_000},
    use: {
        baseURL: 'http://localhost:4173',
        // Default browser language for tests that do not override it.
        locale: 'en-US',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Allow using a system Chromium (e.g. the snap build) when
                // Playwright's bundled browser is unavailable.
                ...(chromiumExecutable
                    ? {launchOptions: {executablePath: chromiumExecutable}}
                    : {}),
            },
        },
    ],
    webServer: {
        command: 'bun run build && PORT=4173 node .output/server/index.mjs',
        url: 'http://localhost:4173/en',
        reuseExistingServer: !process.env.CI,
        timeout: 600_000,
    },
})
