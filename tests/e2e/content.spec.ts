import {expect, test} from '@playwright/test'
import {gotoHydrated} from './helpers'

test.describe('migrated content smoke', () => {
    test('jep-512 renders cover, code, TOC, license and comments', async ({page}) => {
        await gotoHydrated(page, '/p/jep-512')

        await expect(page.locator('main img').first()).toBeVisible()
        expect(await page.locator('main pre').count()).toBeGreaterThan(0)
        await expect(page.getByRole('navigation', {name: 'Table of contents'})).toBeVisible()
        await expect(page.locator('main')).toContainText('CC BY-NC-SA')
        await expect(page.locator('main')).toContainText('评论')
    })

    test('jep-401 keeps hand-written anchors and tables', async ({page}) => {
        await gotoHydrated(page, '/p/jep-401')

        await expect(page.locator('#serialization')).toHaveCount(1)
        await expect(page.locator('#reflection')).toHaveCount(1)
        await expect(page.locator('a[href="#serialization"]').first()).toBeVisible()
        expect(await page.locator('main table').count()).toBeGreaterThan(0)
        await expect(page.locator('main')).not.toContainText(':span{')
    })

    test('style reference renders prose, math, footnotes and safe external links', async ({page}) => {
        await gotoHydrated(page, '/dev/style')

        await expect(page.locator('.katex').first()).toBeVisible()
        expect(await page.locator('.katex').count()).toBeGreaterThan(0)
        expect(await page.locator('[data-footnotes]').count()).toBeGreaterThan(0)
        await expect(page.locator('.callout').first()).toBeVisible()

        const external = page.locator('.post-body a[href^="http"]').first()
        await expect(external).toHaveAttribute('target', '_blank')
        await expect(external).toHaveAttribute('rel', /noopener/)
    })

    test('about page keeps the Spotify embed and footnotes', async ({page}) => {
        await gotoHydrated(page, '/about')

        await expect(page.locator('iframe[src*="open.spotify.com"]')).toHaveCount(1)
        expect(await page.locator('[data-footnotes]').count()).toBeGreaterThan(0)
    })
})
