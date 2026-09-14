import {expect, test} from '@playwright/test'
import {gotoHydrated} from './helpers'

const desktop = {width: 1440, height: 900}
const mobile = {width: 390, height: 844}

test.describe(
    'navigation',
    () => {
        test(
            'the desktop rail moves between the primary sections',
            async ({page}) => {
                await page.setViewportSize(desktop)
                await gotoHydrated(page, '/en')

                const nav = page.locator('.site-nav:visible')

                await nav.getByRole('link', {name: 'Articles'}).click()
                await expect(page).toHaveURL(/\/en\/articles$/)

                await nav.getByRole('link', {name: 'Novels'}).click()
                await expect(page).toHaveURL(/\/en\/novels$/)

                await nav.getByRole('link', {name: 'Tags'}).click()
                await expect(page).toHaveURL(/\/en\/tags$/)
            }
        )

        test(
            'mobile keeps a bottom dock and a More sheet',
            async ({page}) => {
                await page.setViewportSize(mobile)
                await gotoHydrated(page, '/en')

                const dock = page.locator('.site-nav:visible')
                await expect(dock.getByRole('link', {name: 'Friends'})).toBeVisible()

                await dock.getByRole('button', {name: 'More'}).click()

                const sheet = page.getByRole('dialog')
                await expect(sheet.getByRole('link', {name: 'Archives'})).toBeVisible()

                await sheet.getByRole('link', {name: 'Archives'}).click()
                await expect(page).toHaveURL(/\/en\/archives$/)
            }
        )
    }
)

test.describe(
    'language entry',
    () => {
        test(
            'keeps the explicit English prefix',
            async ({page}) => {
                await gotoHydrated(page, '/en/articles')
                await expect(page).toHaveURL(/\/en\/articles$/)
            }
        )

        test(
            'switching language updates the URL and the stored preference',
            async ({page, context}) => {
                await page.setViewportSize(desktop)
                await gotoHydrated(page, '/en/articles/jep-512')

                await page.locator('.site-nav:visible')
                    .getByRole('button', {name: 'Language'})
                    .click()
                await page.getByRole('menuitemcheckbox', {name: '简体中文'}).click()

                await expect(page).toHaveURL(/\/zh-cn\/articles\/jep-512$/)
                await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')

                const cookie = (await context.cookies()).find(item => item.name === 'blog_locale')
                expect(cookie?.value).toBe('zh-cn')

                await page.goto('/')
                await expect(page).toHaveURL(/\/zh-cn$/)
            }
        )

        test(
            'an explicit locale URL is not rewritten by the stored preference',
            async ({page, context}) => {
                await context.addCookies([
                    {name: 'blog_locale', value: 'en', url: 'http://localhost:4173/'},
                ])

                await gotoHydrated(page, '/zh-tw/articles/jep-512')
                await expect(page).toHaveURL(/\/zh-tw\/articles\/jep-512$/)
                await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW')
            }
        )

        test(
            'a tag detail page switches to the target tag index',
            async ({page, context}) => {
                await page.setViewportSize(desktop)
                await gotoHydrated(page, '/en/tags/java')

                await page.locator('.site-nav:visible')
                    .getByRole('button', {name: 'Language'})
                    .click()
                await page.getByRole('menuitemcheckbox', {name: '简体中文'}).click()

                await expect(page).toHaveURL(/\/zh-cn\/tags$/)
                await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')

                const cookie = (await context.cookies()).find(item => item.name === 'blog_locale')
                expect(cookie?.value).toBe('zh-cn')
            }
        )
    }
)

test.describe(
    'language detection',
    () => {
        test.use({locale: 'zh-TW'})

        test(
            'uses the browser language when the URL has no prefix',
            async ({page}) => {
                await page.goto('/')
                await expect(page).toHaveURL(/\/zh-tw$/)
                await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW')
            }
        )
    }
)

test.describe(
    'language fallback',
    () => {
        test.use({locale: 'fr-FR'})

        test(
            'falls back to English',
            async ({page}) => {
                await page.goto('/')
                await expect(page).toHaveURL(/\/en$/)
                await expect(page.locator('html')).toHaveAttribute('lang', 'en')
            }
        )
    }
)

test.describe(
    'theme',
    () => {
        test(
            'dark mode survives a reload',
            async ({page}) => {
                await page.setViewportSize(desktop)
                await gotoHydrated(page, '/en')

                const html = page.locator('html')
                await page.locator('.site-nav:visible')
                    .getByRole('button', {name: 'Toggle theme'})
                    .click()
                await expect(html).toHaveClass(/\bdark\b/)

                await page.reload()
                await expect(html).toHaveClass(/\bdark\b/)
            }
        )
    }
)

test.describe(
    'search',
    () => {
        test(
            'Ctrl+K opens the palette and the keyboard drives it',
            async ({page}) => {
                await gotoHydrated(page, '/en')

                const dialog = page.getByRole('dialog')
                await page.keyboard.press('Control+k')

                try {
                    await expect(dialog).toBeVisible({timeout: 2_500})
                } catch {
                    await page.keyboard.press('Control+k')
                    await expect(dialog).toBeVisible()
                }

                await dialog.getByRole('combobox').fill('jep')
                await expect(dialog.getByRole('option').first()).toBeVisible()

                await page.keyboard.press('ArrowDown')
                await page.keyboard.press('Enter')

                await expect(dialog).toBeHidden()
                await expect(page).toHaveURL(/\/en\/(articles|novels)\/.+/)
            }
        )

        test(
            'Escape closes the palette',
            async ({page}) => {
                await gotoHydrated(page, '/en')

                const dialog = page.getByRole('dialog')
                await page.keyboard.press('Control+k')

                try {
                    await expect(dialog).toBeVisible({timeout: 2_500})
                } catch {
                    await page.keyboard.press('Control+k')
                    await expect(dialog).toBeVisible()
                }

                await page.keyboard.press('Escape')
                await expect(dialog).toBeHidden()
            }
        )

        test(
            'search stays within the page language',
            async ({page}) => {
                await gotoHydrated(page, '/en/search?q=jep')

                const first = page.locator('[data-testid="search-result"]').first()
                await expect(first).toBeVisible({timeout: 20_000})
                await first.click()
                await expect(page).toHaveURL(/^http:\/\/localhost:4173\/en\//)
            }
        )
    }
)

test.describe(
    'filters',
    () => {
        test(
            'the article subtype filter drives the URL and history',
            async ({page}) => {
                await gotoHydrated(page, '/en/articles')

                await page.getByRole('button', {name: /Translation/}).click()
                await expect(page).toHaveURL(/\?type=translation/)

                await page.goBack()
                await expect(page).toHaveURL(/\/en\/articles$/)
            }
        )

        test(
            'the novel status filter drives the URL',
            async ({page}) => {
                await gotoHydrated(page, '/en/novels')

                await page.getByRole('button', {name: /Complete/}).click()
                await expect(page).toHaveURL(/\?status=complete/)
            }
        )
    }
)

test.describe(
    'novel reader',
    () => {
        test(
            'desktop offers reading settings and Escape exits reading mode',
            async ({page}) => {
                await page.setViewportSize(desktop)
                await gotoHydrated(page, '/en/novels/causerie-2')

                await page.getByRole('button', {name: 'Reading settings'}).click()

                const panel = page.getByRole('dialog')
                await expect(panel.getByRole('group', {name: 'Text size'})).toBeVisible()
                await expect(panel.getByRole('group', {name: 'Line spacing'})).toBeVisible()
                await expect(panel.getByRole('group', {name: 'Column width'})).toBeVisible()

                await panel.getByRole('switch', {name: 'Reading mode'}).click()
                await expect(page.locator('html')).toHaveClass(/reading-mode/)

                await page.keyboard.press('Escape')
                await expect(page.locator('html')).not.toHaveClass(/reading-mode/)
            }
        )

        test(
            'mobile opens the settings sheet',
            async ({page}) => {
                await page.setViewportSize(mobile)
                await gotoHydrated(page, '/en/novels/causerie-2')

                await page.getByRole('button', {name: 'Reading settings'}).click()

                const sheet = page.getByRole('dialog')
                await expect(sheet.getByRole('group', {name: 'Text size'})).toBeVisible()
                await expect(sheet.getByRole('group', {name: 'Line spacing'})).toBeVisible()
                await expect(sheet.getByRole('switch', {name: 'Reading mode'})).toBeVisible()
                await expect(sheet.getByRole('group', {name: 'Column width'})).toHaveCount(0)
            }
        )
    }
)
