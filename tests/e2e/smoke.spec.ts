import {expect, test} from '@playwright/test'
import {expectNoHorizontalOverflow, gotoHydrated} from './helpers'

const pages = [
    '/en',
    '/en/articles',
    '/en/novels',
    '/en/tags',
    '/en/archives',
    '/en/friends',
    '/en/search',
    '/en/dev/style',
] as const

test.describe(
    'core pages',
    () => {
        for (const path of pages) {
            test(
                `renders ${path}`,
                async ({page}) => {
                    const errors: Error[] = []
                    page.on('pageerror', error => errors.push(error))

                    await gotoHydrated(page, path)
                    await expect(page.locator('main h1').first()).toBeVisible()
                    await expectNoHorizontalOverflow(page, path)
                    expect(errors, `uncaught errors on ${path}`).toEqual([])
                }
            )
        }

        test(
            'reaches the other locales',
            async ({page}) => {
                for (const path of ['/zh-cn', '/zh-tw']) {
                    await gotoHydrated(page, path)
                    await expect(page.locator('main h1').first()).toBeVisible()
                }
            }
        )
    }
)

test.describe(
    'readers',
    () => {
        test(
            'article reader renders the body, code, TOC, license and comments',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/articles/jep-512')

                await expect(page.locator('main h1').first()).toBeVisible()
                expect(await page.locator('main pre').count()).toBeGreaterThan(0)
                await expect(page.getByRole('navigation', {name: 'Table of contents'}))
                    .toBeVisible()
                await expect(page.locator('main')).toContainText('CC BY-NC-SA')
                await expect(page.locator('main')).toContainText('评论')
            }
        )

        test(
            'novel reader renders a title page, body and colophon',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/novels/causerie-2')

                await expect(page.locator('main h1').first()).toBeVisible()
                await expect(page.locator('main .novel-scene-break')).toHaveCount(1)
                await expect(page.getByRole('navigation', {name: 'Table of contents'}))
                    .toHaveCount(0)
            }
        )
    }
)

test.describe(
    '404',
    () => {
        test(
            'an unknown route renders the not-found page',
            async ({page}) => {
                const response = await page.goto('/en/does-not-exist')
                expect(response?.status()).toBe(404)

                await expect(page.locator('main')).toContainText('LOST')
                await expect(page.getByRole('button', {name: 'Back home'})).toBeVisible()
            }
        )

        test(
            'the legacy URLs are gone',
            async ({request}) => {
                for (const path of [
                    '/en/p/jep-512',
                    '/en/blog',
                    '/en/about',
                    '/en/links',
                    '/index.xml'
                ]) {
                    const response = await request.get(path)
                    expect(response.status(), path).toBe(404)
                }
            }
        )
    }
)
