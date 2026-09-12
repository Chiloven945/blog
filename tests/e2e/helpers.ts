import {expect, type Page} from '@playwright/test'

type NuxtRoot = HTMLElement & { __vue_app__?: unknown }

/** Navigate and wait until the Nuxt client app has hydrated. */
export async function gotoHydrated(page: Page, path: string): Promise<void> {
    await page.goto(path, {waitUntil: 'domcontentloaded'})
    await page.waitForFunction(
        () => Boolean((document.querySelector('#__nuxt') as NuxtRoot | null)?.__vue_app__),
        undefined,
        {timeout: 20_000},
    )
}

/** Assert the document does not scroll horizontally. */
export async function expectNoHorizontalOverflow(page: Page, label = ''): Promise<void> {
    const size = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
    }))

    expect(
        size.scrollWidth,
        `${label}: scrollWidth ${size.scrollWidth} > clientWidth ${size.clientWidth}`,
    ).toBeLessThanOrEqual(size.clientWidth + 1)
}

export interface WebVitals {
    lcp: number
    cls: number
}

/** Collect Largest Contentful Paint and Cumulative Layout Shift. */
export async function collectWebVitals(page: Page): Promise<WebVitals> {
    return page.evaluate(async () => {
        const lcp = await new Promise<number>((resolve) => {
            let value = 0

            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        value = entry.startTime
                    }
                })

                observer.observe({type: 'largest-contentful-paint', buffered: true})
                setTimeout(() => {
                    observer.disconnect()
                    resolve(value)
                }, 1200)
            } catch {
                resolve(-1)
            }
        })

        const cls = await new Promise<number>((resolve) => {
            let value = 0

            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries() as Array<
                        PerformanceEntry & { value?: number; hadRecentInput?: boolean }
                    >) {
                        if (!entry.hadRecentInput) {
                            value += entry.value ?? 0
                        }
                    }
                })

                observer.observe({type: 'layout-shift', buffered: true})
                setTimeout(() => {
                    observer.disconnect()
                    resolve(value)
                }, 1200)
            } catch {
                resolve(-1)
            }
        })

        return {lcp, cls}
    })
}
