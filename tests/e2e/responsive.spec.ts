import {expect, test} from '@playwright/test'
import {expectNoHorizontalOverflow, gotoHydrated} from './helpers'

const breakpoints = [
    {name: 'mobile', width: 390, height: 844},
    {name: 'tablet', width: 768, height: 1024},
    {name: 'desktop', width: 1440, height: 900},
] as const

const pages = [
    '/en',
    '/en/articles',
    '/en/articles/jep-512',
    '/en/novels/causerie-2',
] as const

for (const breakpoint of breakpoints) {
    test.describe(`${breakpoint.name} breakpoint`, () => {
        test.use({viewport: {width: breakpoint.width, height: breakpoint.height}})

        for (const path of pages) {
            test(`no horizontal overflow: ${path}`, async ({page}) => {
                await gotoHydrated(page, path)
                await expect(page.locator('main h1').first()).toBeVisible()
                await expectNoHorizontalOverflow(page, `${breakpoint.name}:${path}`)
            })
        }
    })
}

test.describe('mobile composition', () => {
    test.use({viewport: {width: 390, height: 844}})

    test('code blocks scroll inside their own container', async ({page}) => {
        await gotoHydrated(page, '/zh-cn/articles/jep-401')

        const pre = page.locator('main pre').first()
        await pre.scrollIntoViewIfNeeded()
        expect(await pre.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true)
        await expectNoHorizontalOverflow(page, 'mobile code')
    })
})
