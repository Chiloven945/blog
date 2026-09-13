import {expect, test} from '@playwright/test'
import {expectNoHorizontalOverflow, gotoHydrated} from './helpers'

const keyPages = [
    {path: '/', heading: 'CHILOVEN'},
    {path: '/articles', heading: '文章'},
    {path: '/novels', heading: '小说'},
    {path: '/archives', heading: '归档'},
    {path: '/friends', heading: '友链'},
    {path: '/links', heading: '链接'},
    {path: '/about', heading: '关于'},
    {path: '/search', heading: '搜索'},
] as const

test.describe(
    'key pages',
    () => {
        for (const {path, heading} of keyPages) {
            test(
                `renders ${path}`,
                async ({page}) => {
                    await gotoHydrated(page, path)
                    await expect(page.locator('main h1').first()).toContainText(heading)
                    await expectNoHorizontalOverflow(page, path)
                }
            )
        }

        test(
            'renders a post with header, TOC and comments',
            async ({page}) => {
                await gotoHydrated(page, '/p/jep-512')
                await expect(page.locator('main h1')).toContainText('JEP 512')
                await expect(page.getByRole(
                    'navigation',
                    {name: 'Table of contents'}
                )).toBeVisible()
                await expect(page.locator('main')).toContainText('评论')
                await expectNoHorizontalOverflow(page, '/p/jep-512')
            }
        )

        test(
            'article index features articles and filters by subtype',
            async ({page}) => {
                await gotoHydrated(page, '/articles')

                await expect(page.locator('main')).toContainText('精选')
                const rows = page.locator('main ol li')
                expect(await rows.count()).toBeGreaterThan(1)

                await page.getByRole('button', {name: '翻译'}).click()
                await expect(page).toHaveURL(/\?type=translation/)
                await expect(rows).toHaveCount(2)

                await page.getByRole('button', {name: '全部'}).click()
                await expect(page).not.toHaveURL(/\?type=/)
                expect(await rows.count()).toBeGreaterThan(1)
            }
        )

        test(
            'novel library lists works and filters by status',
            async ({page}) => {
                await gotoHydrated(page, '/novels')

                await expect(page.locator('main')).toContainText('连载中')
                const works = page.locator('main article')
                expect(await works.count()).toBeGreaterThan(1)

                await page.getByRole('button', {name: '已完成'}).click()
                await expect(page).toHaveURL(/\?status=complete/)
                await expect(works).toHaveCount(3)
            }
        )

        test(
            'shows the 404 page for unknown routes',
            async ({page}) => {
                const response = await page.goto('/does-not-exist')
                expect(response?.status()).toBe(404)
                await page.waitForFunction(
                    () =>
                        Boolean((document.querySelector('#__nuxt') as HTMLElement
                            & { __vue_app__?: unknown })?.__vue_app__),
                    undefined,
                    {timeout: 20_000},
                )
                await expect(page.locator('main')).toContainText('迷失')
                await expect(page.getByRole('button', {name: '返回首页'})).toBeVisible()
            }
        )
    }
)

test.describe('locales', () => {
    test(
        'serves English under /en',
        async ({page}) => {
            await gotoHydrated(page, '/en/articles')
            await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
            await expect(page.locator('main h1').first()).toContainText('Articles')
        }
    )

    test(
        'serves Traditional Chinese under /zh-tw',
        async ({page}) => {
            await gotoHydrated(page, '/zh-tw/about')
            await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW')
            await expect(page.locator('main h1').first()).toContainText('關於')
        }
    )

    test(
        'switches locale from the navigation',
        async ({page}) => {
            await gotoHydrated(page, '/articles')
            const nav = page.locator('.site-nav:visible')
            await nav.getByRole('button', {name: '语言'}).click()
            await page.getByRole('menuitemcheckbox', {name: 'English'}).click()
            await expect(page).toHaveURL(/\/en\/articles$/)
            await expect(page.locator('main h1').first()).toContainText('Articles')
        }
    )
})

test.describe(
    'color mode',
    () => {
        test(
            'toggles dark mode from the navigation',
            async ({page}) => {
                await gotoHydrated(page, '/')
                const html = page.locator('html')
                await expect(html).not.toHaveClass(/\bdark\b/)
                await page.locator('.site-nav:visible')
                    .getByRole('button', {name: '切换主题'})
                    .click()
                await expect(html).toHaveClass(/\bdark\b/)
                await expectNoHorizontalOverflow(page, '/ dark')
            }
        )
    }
)
