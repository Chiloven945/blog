import {expect, test} from '@playwright/test'
import {collectWebVitals, gotoHydrated} from './helpers'

const pages = ['/', '/blog', '/p/jep-401'] as const

// Core Web Vitals are measured on Chromium, the reference engine
// (ROADMAP §36.7). Budgets are sanity bounds, not hard targets.
test.describe('core web vitals', () => {
    test.skip(({browserName}) => browserName !== 'chromium', 'measured on Chromium')

    for (const path of pages) {
        test(`LCP and CLS stay within budget on ${path}`, async ({page}) => {
            test.slow()

            await gotoHydrated(page, path)
            await page.waitForTimeout(300)

            const {lcp, cls} = await collectWebVitals(page)

            expect(lcp, `LCP on ${path}`).toBeGreaterThan(0)
            expect(lcp, `LCP on ${path} is ${Math.round(lcp)}ms`).toBeLessThan(4000)
            expect(cls, `CLS on ${path} is ${cls.toFixed(4)}`).toBeLessThan(0.1)
        })
    }
})
