import {expect, test} from '@playwright/test'
import {gotoHydrated} from './helpers'

test.describe('landmarks and names', () => {
    test('representative pages expose one main, one h1 and named controls', async ({page}) => {
        for (const path of ['/en', '/en/articles/jep-512']) {
            await gotoHydrated(page, path)

            await expect(page.locator('main#main')).toHaveCount(1)
            await expect(page.locator('h1')).toHaveCount(1)
            await expect(page.locator('.site-nav:visible')).toHaveCount(1)
            await expect(page.locator('footer')).toHaveCount(1)
        }

        const nameless = await page.evaluate(() => {
            const label = (element: Element) =>
                (element.getAttribute('aria-label') ?? '').trim()
                || (element.getAttribute('title') ?? '').trim()
                || (element.textContent ?? '').trim()

            return {
                images: [...document.querySelectorAll('img')]
                    .filter(image => !image.hasAttribute('alt')).length,
                buttons: [...document.querySelectorAll('button')]
                    .filter(button => !label(button)).length,
                links: [...document.querySelectorAll('a')]
                    .filter(anchor => !label(anchor)).length,
            }
        })

        expect(nameless, 'controls without an accessible name').toEqual({
            images: 0,
            buttons: 0,
            links: 0,
        })
    })

    test('the article exposes a labelled table-of-contents landmark', async ({page}) => {
        await gotoHydrated(page, '/zh-cn/articles/jep-512')
        await expect(page.getByRole('navigation', {name: 'Table of contents'})).toBeVisible()
    })
})

test.describe('keyboard', () => {
    test('the skip link is the first stop and focuses main', async ({page}) => {
        await gotoHydrated(page, '/en')

        await page.keyboard.press('Tab')
        await expect(page.locator('a.skip-link')).toBeFocused()
        await page.keyboard.press('Enter')
        await expect(page.locator('main#main')).toBeFocused()
    })

    test('the search palette exposes a combobox relationship', async ({page}) => {
        await gotoHydrated(page, '/en')

        const dialog = page.getByRole('dialog')
        await page.keyboard.press('Control+k')

        try {
            await expect(dialog).toBeVisible({timeout: 2_500})
        } catch {
            await page.keyboard.press('Control+k')
            await expect(dialog).toBeVisible()
        }

        const input = dialog.getByRole('combobox')
        await expect(input).toHaveAttribute('aria-expanded', 'true')
        await input.fill('jep')
        await expect(input).toHaveAttribute('aria-activedescendant', 'search-result-0')

        await page.keyboard.press('Escape')
    })

    test('the mobile More sheet is escapable', async ({page}) => {
        await page.setViewportSize({width: 390, height: 844})
        await gotoHydrated(page, '/en')

        await page.locator('.site-nav:visible').getByRole('button', {name: 'More'}).click()

        const dialog = page.getByRole('dialog')
        await expect(dialog.getByRole('link', {name: 'Archives'})).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(dialog).toBeHidden()
    })
})

test.describe('reduced motion', () => {
    test.use({reducedMotion: 'reduce'})

    test('all revealed content is immediately visible', async ({page}) => {
        await gotoHydrated(page, '/en')

        const hidden = await page.evaluate(() =>
            [...document.querySelectorAll('.reveal, .reveal-text, .reveal-mask')]
                .filter(element => Number(getComputedStyle(element).opacity) < 1).length,
        )

        expect(hidden, 'elements still hidden under reduced motion').toBe(0)
    })
})

test.describe('no JavaScript', () => {
    test.use({javaScriptEnabled: false})

    test('the article body is still readable', async ({page}) => {
        await page.goto('/zh-cn/articles/jep-512', {waitUntil: 'domcontentloaded'})

        await expect(page.locator('main h1')).toBeVisible()
        await expect(page.locator('main pre').first()).toBeVisible()
    })
})
