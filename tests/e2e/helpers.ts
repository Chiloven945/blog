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
