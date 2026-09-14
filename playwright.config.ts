import {defineConfig, devices} from '@playwright/test'

// The suite runs against the built static deployment (`bun run generate`) served
// by `wrangler dev`: the prerendered assets plus the tiny locale-redirect
// Worker, exactly as Cloudflare runs it. Chromium is the reference engine;
// Firefox/WebKit are checked manually before a release.
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE

// Some sandboxes set an HTTP proxy without excluding loopback; keep the local
// preview server reachable directly.
process.env.NO_PROXY ??= 'localhost,127.0.0.1'
process.env.no_proxy ??= 'localhost,127.0.0.1'

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
        baseURL: 'http://localhost:8787',
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
        command: 'bun run generate && ./node_modules/.bin/wrangler dev --config wrangler.jsonc --port 8787',
        url: 'http://localhost:8787/en',
        reuseExistingServer: !process.env.CI,
        timeout: 600_000,
    },
})
