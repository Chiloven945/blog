import {defineConfig, devices} from '@playwright/test'

// Static regression suite for the generated site.
// `bun test:e2e` builds `.output/public` and serves it with a clean-URL
// static server so production behaviour (no dev HMR, real payloads) is what
// gets tested.
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    // Run sequentially to keep layout and timing checks stable.
    workers: 1,
    reporter: process.env.CI
        ? [['list'], ['html', {open: 'never'}]]
        : [['list'], ['html', {open: 'never'}]],
    timeout: 30_000,
    expect: {timeout: 5_000},
    use: {
        baseURL: 'http://localhost:4173',
        // Keep browser-language detection on the default locale so the root
        // URL does not redirect away from the default locale.
        locale: 'zh-CN',
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
        {name: 'firefox', use: {...devices['Desktop Firefox']}},
        {name: 'webkit', use: {...devices['Desktop Safari']}},
    ],
    webServer: {
        command: 'bun run generate && bun tests/e2e/static-server.ts',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
    },
})
