import {expect, test} from '@playwright/test'
import {expectNoHorizontalOverflow, gotoHydrated} from './helpers'

test.describe(
    'screen reader smoke',
    () => {
        test(
            'home exposes landmarks, a single h1 and named controls',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn')

                await expect(page.locator('main#main')).toHaveCount(1)
                await expect(page.locator('.site-nav:visible')).toHaveCount(1)
                await expect(page.locator('footer')).toHaveCount(1)
                await expect(page.locator('h1')).toHaveCount(1)

                const nameless = await page.evaluate(() => {
                    const label = (el: Element) =>
                        (el.getAttribute('aria-label') ?? '').trim() ||
                        (el.getAttribute('title') ?? '').trim() ||
                        (el.textContent ?? '').trim()

                    return {
                        images: [...document.querySelectorAll('img')]
                            .filter(img => !img.hasAttribute('alt'))
                            .map(img => img.getAttribute('src') ?? ''),
                        buttons: [...document.querySelectorAll('button')]
                            .filter(button => !label(button))
                            .map(button => button.outerHTML.slice(0, 80)),
                        links: [...document.querySelectorAll('a')]
                            .filter(a => !label(a))
                            .map(a => a.getAttribute('href') ?? ''),
                    }
                })

                expect(nameless.images, 'images without alt').toEqual([])
                expect(nameless.buttons, 'buttons without an accessible name').toEqual([])
                expect(nameless.links, 'links without an accessible name').toEqual([])
            }
        )

        test(
            'post has a labelled table-of-contents landmark',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/articles/jep-512')
                await expect(page.getByRole('navigation', {name: 'Table of contents'}))
                    .toBeVisible()
                await expect(page.locator('h1')).toHaveCount(1)
            }
        )
    }
)

test.describe(
    'keyboard',
    () => {
        test(
            'skip link is the first stop and focuses main',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn')
                await page.keyboard.press('Tab')
                await expect(page.locator('a.skip-link')).toBeFocused()
                await page.keyboard.press('Enter')
                await expect(page.locator('main#main')).toBeFocused()
            }
        )

        test(
            'search modal opens with Ctrl+K and supports arrow keys',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn')

                const dialog = page.getByRole('dialog')
                await page.keyboard.press('Control+k')

                // The global shortcut listener attaches during hydration; retry once
                // if the first press lands before the app is interactive.
                try {
                    await expect(dialog).toBeVisible({timeout: 2_500})
                } catch {
                    await page.keyboard.press('Control+k')
                    await expect(dialog).toBeVisible()
                }

                const input = dialog.getByRole('combobox')
                await expect(input).toHaveAttribute('aria-expanded', 'true')
                await input.fill('jep')
                await expect(dialog.getByRole('option').first()).toBeVisible()

                // The input keeps focus while the active option is tracked.
                await expect(input).toHaveAttribute('aria-activedescendant', 'search-result-0')
                await page.keyboard.press('ArrowDown')
                await expect(input).toHaveAttribute('aria-activedescendant', 'search-result-1')

                await page.keyboard.press('Escape')
                await expect(dialog).toBeHidden()
            }
        )

        test(
            'search keeps the keyboard-selected result visible',
            async ({page}) => {
                await page.setViewportSize({width: 1280, height: 720})
                await gotoHydrated(page, '/en')

                const dialog = page.getByRole('dialog')
                await page.keyboard.press('Control+k')

                try {
                    await expect(dialog).toBeVisible({timeout: 2_500})
                } catch {
                    await page.keyboard.press('Control+k')
                    await expect(dialog).toBeVisible()
                }

                await dialog.getByRole('combobox').fill('a')

                const options = dialog.getByRole('option')
                await expect(options.first()).toBeVisible()

                const count = await options.count()
                const steps = Math.min(count - 1, 12)
                for (let i = 0; i < steps; i++) {
                    await page.keyboard.press('ArrowDown')
                }

                const listBox = await dialog.locator('[role="listbox"]').boundingBox()
                const activeBox = await dialog.locator('[aria-selected="true"]').boundingBox()

                expect(listBox).not.toBeNull()
                expect(activeBox).not.toBeNull()
                expect(activeBox!.y).toBeGreaterThanOrEqual(listBox!.y - 1)
                expect(activeBox!.y + activeBox!.height)
                    .toBeLessThanOrEqual(listBox!.y + listBox!.height + 1)

                await page.keyboard.press('Escape')
            }
        )

        test(
            'mobile navigation is reachable and operable',
            async ({page}) => {
                await page.setViewportSize({width: 390, height: 844})
                await gotoHydrated(page, '/zh-cn')

                await page.locator('.site-nav:visible').getByRole('button', {name: '更多'}).click()
                const dialog = page.getByRole('dialog')
                await expect(dialog).toBeVisible()
                await expect(dialog.getByRole('link', {name: '归档'})).toBeVisible()
                await page.keyboard.press('Escape')
                await expect(dialog).toBeHidden()
                await expectNoHorizontalOverflow(page, 'mobile menu')
            }
        )

        test(
            'novel reading mode releases the shell reservation',
            async ({page}) => {
                await page.setViewportSize({width: 1280, height: 900})
                await gotoHydrated(page, '/zh-cn/novels/wip-a')

                const html = page.locator('html')
                const shell = page.locator('.app-shell')
                const toolbar = page.locator('[role="group"][aria-label="阅读设置"]')
                const inlineStart = () => shell.evaluate(el => getComputedStyle(el).paddingInlineStart)

                // The desktop rail reserves 96px until reading mode hides it.
                await expect.poll(inlineStart).toBe('96px')

                await toolbar.getByRole('button', {name: '阅读模式'}).click()
                await expect(html).toHaveClass(/reading-mode/)
                await expect.poll(inlineStart).toBe('0px')
                await expect.poll(() => shell.evaluate(el => getComputedStyle(el).paddingTop))
                    .toBe('0px')

                await page.keyboard.press('Escape')
                await expect(html).not.toHaveClass(/reading-mode/)
            }
        )
    }
)

test.describe(
    'reduced motion',
    () => {
        test.use({reducedMotion: 'reduce'})

        test(
            'all revealed content is immediately visible',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn')

                const result = await page.evaluate(() => {
                    const targets = [
                        ...document.querySelectorAll('.reveal, .reveal-text, .reveal-mask')
                    ]
                    return {
                        total: targets.length,
                        hidden: targets.filter(el => Number(getComputedStyle(el).opacity) < 1).length,
                    }
                })

                expect(result.total).toBeGreaterThan(10)
                expect(result.hidden, 'elements still hidden under reduced motion').toBe(0)
            }
        )
    }
)

test.describe(
    'no JavaScript',
    () => {
        test.use({javaScriptEnabled: false})

        test(
            'home still renders its core content',
            async ({page}) => {
                await page.goto('/zh-cn', {waitUntil: 'domcontentloaded'})
                await expect(page.locator('main h1')).toContainText('CHILOVEN')
                await expect(page.locator('main')).toContainText('PERSONAL SPACE')
                await expect(page.locator('.reveal-text').first()).toHaveText(/.+/)
            }
        )

        test(
            'post still renders its body',
            async ({page}) => {
                await page.goto('/zh-cn/articles/jep-512', {waitUntil: 'domcontentloaded'})
                await expect(page.locator('main h1')).toContainText('JEP 512')
                await expect(page.locator('main pre').first()).toBeVisible()
            }
        )
    }
)
