import {expect, test} from '@playwright/test'
import {expectNoHorizontalOverflow, gotoHydrated} from './helpers'

const viewports = [
    {name: '360', width: 360, height: 800},
    {name: '390', width: 390, height: 844},
    {name: '768', width: 768, height: 1024},
    {name: '1024', width: 1024, height: 768},
    {name: '1280', width: 1280, height: 800},
    {name: '1440', width: 1440, height: 900},
] as const

const pages = ['/', '/articles', '/novels', '/tags', '/p/wip-a'] as const

for (const viewport of viewports) {
    test.describe(
        `viewport ${viewport.name}`,
        () => {
            test.use({viewport: {width: viewport.width, height: viewport.height}})

            for (const path of pages) {
                test(
                    `no horizontal overflow: ${path}`,
                    async ({page}) => {
                        await gotoHydrated(page, path)
                        await expect(page.locator('main h1').first()).toBeVisible()
                        await expectNoHorizontalOverflow(page, `${viewport.name}:${path}`)
                    }
                )
            }
        }
    )
}

test.describe(
    'responsive composition',
    () => {
        test(
            'home sections stay readable on mobile',
            async ({page}) => {
                await page.setViewportSize({width: 390, height: 844})
                await gotoHydrated(page, '/')
                await expect(page.locator('.home-display')).toBeVisible()
                await expect(page.locator('main section').first()).toBeVisible()
                await expectNoHorizontalOverflow(page, 'home mobile')
            }
        )

        test(
            'post code blocks scroll inside their own container',
            async ({page}) => {
                await page.setViewportSize({width: 390, height: 844})
                await gotoHydrated(page, '/p/jep-401')
                const pre = page.locator('main pre').first()
                await pre.scrollIntoViewIfNeeded()
                const overflow = await pre.evaluate((el) => el.scrollWidth > el.clientWidth)
                expect(overflow).toBe(true)
                await expectNoHorizontalOverflow(page, 'post mobile')
            }
        )
    }
)
