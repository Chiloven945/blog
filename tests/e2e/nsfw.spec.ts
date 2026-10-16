import {expect, type Page, test} from '@playwright/test'
import {gotoHydrated} from './helpers'

const desktop = {width: 1440, height: 900}

type TrackedRequest = { url: string }

function trackNsfwRequests(page: Page): TrackedRequest[] {
    const requests: TrackedRequest[] = []

    page.on('request', request => {
        const url = request.url()

        if (url.includes('/nsfw-data/') || url.includes('/nsfw-assets/')) {
            requests.push({url})
        }
    })

    return requests
}

async function openContentSettings(page: Page) {
    await page.locator('.site-nav:visible')
        .getByRole('button', {name: 'Settings'})
        .click()

    const dialog = page.getByRole('dialog', {name: 'Settings'})
    await dialog.getByRole('tab', {name: /Content/}).click()

    return dialog
}

async function enableNsfw(page: Page) {
    await openContentSettings(page)

    await page.getByRole('switch', {name: 'Show NSFW content'}).click()
    await page.getByTestId('nsfw-consent').check()
    await page.getByRole('button', {name: 'Enable'}).click()
    await expect(page.getByRole('switch', {name: 'Show NSFW content'}))
        .toHaveAttribute('aria-checked', 'true')

    await page.getByRole('button', {name: 'Close'}).click()
    await expect(page.getByRole('dialog', {name: 'Settings'})).toBeHidden()
}

test(
    'a fresh browser never reaches NSFW data and shows no NSFW items',
    async ({page}) => {
        await page.setViewportSize(desktop)
        const nsfwRequests = trackNsfwRequests(page)

        await gotoHydrated(page, '/en')
        await expect(page.locator('.nsfw-badge')).toHaveCount(0)

        await gotoHydrated(page, '/en/novels')
        await expect(page.locator('.nsfw-badge')).toHaveCount(0)

        await gotoHydrated(page, '/en/articles')
        await expect(page.locator('.nsfw-badge')).toHaveCount(0)
        await expect(page.getByText('NSFW Placeholder Article')).toHaveCount(0)

        // Opening Search loads only the normal index.
        await page.keyboard.press('Control+k')
        await expect(page.getByRole('combobox')).toBeVisible()
        await page.keyboard.press('Escape')

        // Default browsing must not even fetch the protected metadata.
        expect(nsfwRequests).toEqual([])
    }
)

test(
    'enabling NSFW loads the manifest and merges a blurred item',
    async ({page}) => {
        await page.setViewportSize(desktop)
        const nsfwRequests = trackNsfwRequests(page)

        await gotoHydrated(page, '/en/articles')
        await expect(page.locator('.nsfw-badge')).toHaveCount(0)

        await enableNsfw(page)

        expect((await page.context().cookies()).find(cookie => cookie.name === 'blog_nsfw')?.value)
            .toBe('1')

        // The merged NSFW article appears with a badge and, by default, a blur guard.
        await expect(page.locator('.nsfw-badge').first()).toBeVisible()
        await expect(page.locator('.nsfw-guard__overlay').first()).toBeVisible()
        expect(nsfwRequests.length).toBeGreaterThan(0)
    }
)

test(
    'a blurred NSFW preview reveals, keeps its badge, and re-blurs after reload',
    async ({page}) => {
        await page.setViewportSize(desktop)

        await gotoHydrated(page, '/en/articles')
        await enableNsfw(page)

        const overlays = page.locator('.nsfw-guard__overlay')
        await expect(overlays.first()).toBeVisible()
        const overlaysBefore = await overlays.count()

        await overlays.first().getByRole('button', {name: 'Reveal'}).click()
        await expect(overlays).toHaveCount(overlaysBefore - 1)

        // The permanent content classification survives the reveal.
        await expect(page.locator('.nsfw-badge').first()).toBeVisible()

        // Per-item reveal state is intentionally not persisted.
        await page.reload()
        await expect.poll(() => page.locator('.nsfw-guard__overlay').count())
            .toBeGreaterThan(0)
    }
)

test(
    'disabling blur shows previews without a guard but keeps the badge',
    async ({page}) => {
        await page.setViewportSize(desktop)

        await gotoHydrated(page, '/en/articles')
        await openContentSettings(page)

        await page.getByRole('switch', {name: 'Show NSFW content'}).click()
        await page.getByTestId('nsfw-consent').check()
        await page.getByRole('button', {name: 'Enable'}).click()
        await page.getByRole('switch', {name: 'Blur NSFW content'}).click()

        await page.getByRole('button', {name: 'Close'}).click()

        await expect(page.locator('.nsfw-badge').first()).toBeVisible()
        await expect(page.locator('.nsfw-guard__overlay')).toHaveCount(0)
    }
)

test(
    'a blocked NSFW deep link explains itself and can be enabled',
    async ({page}) => {
        await page.setViewportSize(desktop)

        // Protected data and assets are invisible while the preference is off.
        expect((await page.request.get('/nsfw-data/content/en.json')).status()).toBe(404)
        expect((await page.request.get('/nsfw-assets/placeholder.svg')).status()).toBe(404)

        // Without the cookie the Worker redirects the document to a safe page.
        await gotoHydrated(page, '/en/nsfw/articles/nsfw-note')
        await expect(page).toHaveURL(/\/en\/articles\?nsfw=required&next=/)

        // The client explains the situation and opens Settings -> Content.
        await expect(page.locator('[data-nsfw-required]')).toBeVisible()

        // Confirming follows the validated target.
        await page.getByRole('switch', {name: 'Show NSFW content'}).click()
        await page.getByTestId('nsfw-consent').check()
        await page.getByRole('button', {name: 'Enable'}).click()
        await expect(page).toHaveURL(/\/en\/nsfw\/articles\/nsfw-note$/)

        // The protected resources become reachable once opted in.
        expect((await page.request.get('/nsfw-data/content/en.json')).status()).toBe(200)
    }
)
