import {expect, test} from '@playwright/test'
import {gotoHydrated} from './helpers'

test.describe(
    'migrated content smoke',
    () => {
        test(
            'jep-512 renders cover, source notice, code, TOC, license and comments',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/articles/jep-512')

                await expect(page.locator('main img').first()).toBeVisible()
                expect(await page.locator('main pre').count()).toBeGreaterThan(0)
                await expect(page.getByRole('navigation', {name: 'Table of contents'}))
                    .toBeVisible()
                await expect(page.locator('main')).toContainText('来源')
                await expect(page.locator('main a[href*="openjdk.org/jeps/512"]').first())
                    .toBeVisible()
                await expect(page.locator('main')).toContainText('CC BY-NC-SA')
                await expect(page.locator('main')).toContainText('评论')
            }
        )

        test(
            'article TOC rail stays sticky and tracks the active section',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/articles/jep-512')

                const tools = page.locator('.article-tools')
                await expect(tools).toBeVisible()

                await page.evaluate(() => window.scrollTo(0, 2000))
                await page.waitForTimeout(250)
                const firstTop = await tools.evaluate(el =>
                    Math.round(el.getBoundingClientRect().top),
                )

                await page.evaluate(() => window.scrollTo(0, 9000))
                await page.waitForTimeout(300)
                const secondTop = await tools.evaluate(el =>
                    Math.round(el.getBoundingClientRect().top),
                )

                // The rail must not scroll away with the article.
                expect(Math.abs(firstTop - secondTop)).toBeLessThanOrEqual(2)
                expect(secondTop).toBeLessThan(150)

                await expect(
                    page.locator('nav[aria-label="Table of contents"] a[data-active="true"]'),
                ).toHaveCount(1)
            }
        )

        test(
            'jep-401 keeps hand-written anchors and tables',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/articles/jep-401')

                await expect(page.locator('#serialization')).toHaveCount(1)
                await expect(page.locator('#reflection')).toHaveCount(1)
                await expect(page.locator('a[href="#serialization"]').first()).toBeVisible()
                expect(await page.locator('main table').count()).toBeGreaterThan(0)
                await expect(page.locator('main')).not.toContainText(':span{')
            }
        )

        test(
            'home keeps the structured profile notes',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn')

                await expect(page.locator('main')).toContainText('ClovenBugle')
                await expect(page.locator('main')).toContainText('Xbox')
            }
        )

        test(
            'novel reader renders a title page, scene break and colophon',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/novels/causerie-2')

                await expect(page.locator('main h1')).toContainText('信使')
                await expect(page.locator('main .novel-scene-break')).toHaveCount(1)
                // Content after the scene break must still render.
                await expect(page.locator('main')).toContainText('至少，信是热的')
                await expect(page.locator('main')).toContainText('保留所有权利')
                expect(await page.getByRole('navigation', {name: 'Table of contents'}).count())
                    .toBe(0)

                const family = await page.locator('.prose-novel').first().evaluate(
                    el => getComputedStyle(el).fontFamily,
                )
                expect(family).toContain('Source Han Serif')
            }
        )

        test(
            'article and novel footnote styles differ and are labelled',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/dev/style')

                const articleRef = page
                    .locator('[data-footnote-example="article"] a[data-footnote-ref]')
                    .first()
                const novelRef = page
                    .locator('[data-footnote-example="novel"] a[data-footnote-ref]')
                    .first()

                const articleFamily = await articleRef.evaluate(el =>
                    getComputedStyle(el).fontFamily,
                )
                const novelFamily = await novelRef.evaluate(el =>
                    getComputedStyle(el).fontFamily,
                )
                expect(articleFamily).toContain('Google Sans Flex')
                expect(novelFamily).toContain('Libre Baskerville')

                const label = await page
                    .locator('[data-footnote-example="article"] [data-footnotes]')
                    .evaluate(el => getComputedStyle(el, '::before').content)
                expect(label).toContain('Notes')
            }
        )

        test(
            'license: CC badge has alt text and All Rights Reserved does not link to CC',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/articles/jep-512')
                await expect(page.locator('main img[alt="CC BY-NC-SA 4.0"]').first())
                    .toBeVisible()
                await expect(page.locator('main a[href*="creativecommons.org"]').first())
                    .toBeVisible()

                await gotoHydrated(page, '/zh-cn/novels/causerie-1')
                await expect(page.locator('main')).toContainText('保留所有权利')
                await expect(page.locator('main a[href*="creativecommons.org"]'))
                    .toHaveCount(0)
            }
        )

        test(
            'related content is rendered per kind',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/articles/jep-512')
                await expect(page.locator('#related-articles')).toBeVisible()
                await expect(page.locator('#related-novels')).toHaveCount(0)

                await gotoHydrated(page, '/zh-cn/novels/causerie-1')
                await expect(page.locator('#related-novels')).toBeVisible()
                await expect(page.locator('#related-articles')).toHaveCount(0)
            }
        )
    }
)
