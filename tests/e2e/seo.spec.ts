import {expect, test} from '@playwright/test'
import {gotoHydrated} from './helpers'

const siteUrl = 'https://www.chiloven.top'

test.describe('internal links', () => {
    test('every internal link returns 200', async ({page, request}) => {
        test.slow()

        const entries = [
            '/en',
            '/en/articles',
            '/en/novels',
            '/en/tags',
            '/en/archives',
            '/en/friends',
            '/zh-cn',
            '/zh-tw',
        ]
        const urls = new Set<string>()

        for (const entry of entries) {
            await page.goto(entry, {waitUntil: 'domcontentloaded'})
            const hrefs = await page.$$eval(
                'a[href]',
                anchors => anchors.map(anchor => anchor.getAttribute('href') ?? ''),
            )

            for (const href of hrefs) {
                if (!href.startsWith('/') || href.startsWith('//')) {
                    continue
                }

                const clean = href.split('#')[0]?.split('?')[0] ?? ''

                if (clean) {
                    urls.add(clean)
                }
            }
        }

        const failures: string[] = []

        for (const url of urls) {
            const response = await request.get(url)

            if (!response.ok()) {
                failures.push(`${url} -> ${response.status()}`)
            }
        }

        expect(failures, 'broken internal links').toEqual([])
    })
})

test.describe('feeds', () => {
    test('serves one RSS feed per language', async ({request}) => {
        for (const path of ['/en/rss.xml', '/zh-cn/rss.xml', '/zh-tw/rss.xml']) {
            const response = await request.get(path)
            expect(response.status(), path).toBe(200)

            const body = await response.text()
            expect(body, path).toContain('<rss')
            expect(body, path).toContain('<item>')
            expect(body, path).toContain(`${siteUrl}/${path.split('/')[1]}/`)
            expect(body, path).not.toContain('/p/')
        }

        expect((await request.get('/index.xml')).status()).toBe(404)
    })
})

test.describe('sitemap', () => {
    test('lists locale canonicals and no dispatchers', async ({request}) => {
        const index = await request.get('/sitemap_index.xml')
        expect(index.status()).toBe(200)

        const indexBody = await index.text()
        const sitemaps = [...indexBody.matchAll(/<loc>([^<]+)<\/loc>/g)]
            .map(match => new URL(match[1]!).pathname)
        expect(sitemaps.length).toBeGreaterThan(0)

        const locs: string[] = []

        for (const sitemap of sitemaps) {
            const response = await request.get(sitemap)
            expect(response.status(), sitemap).toBe(200)

            const xml = await response.text()
            locs.push(
                ...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
                    .map(match => new URL(match[1]!).pathname),
            )
        }

        for (const path of [
            '/en/articles',
            '/zh-cn/articles',
            '/zh-tw/articles',
            '/en/novels',
            '/zh-cn/novels',
            '/zh-tw/novels',
        ]) {
            expect(locs, path).toContain(path)
        }

        expect(locs.filter(path => path.includes('/p/'))).toEqual([])
        expect(locs.filter(path => path.includes('/search'))).toEqual([])
        expect(locs.filter(path => path.includes('/dev/'))).toEqual([])
        expect(locs.filter(path => !/^\/(en|zh-cn|zh-tw)(\/|$)/.test(path))).toEqual([])
    })
})

test.describe('metadata', () => {
    test('a localized article carries canonical and full hreflang', async ({page}) => {
        await gotoHydrated(page, '/en/articles/jep-512')

        await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
            'href',
            `${siteUrl}/en/articles/jep-512`,
        )

        const hreflang = await page.$$eval(
            'link[rel=alternate][hreflang]',
            links => links.map(link => `${link.getAttribute('hreflang')}=${link.getAttribute('href')}`),
        )
        expect(hreflang).toContain(`en=${siteUrl}/en/articles/jep-512`)
        expect(hreflang).toContain(`zh-CN=${siteUrl}/zh-cn/articles/jep-512`)
        expect(hreflang).toContain(`zh-TW=${siteUrl}/zh-tw/articles/jep-512`)
        expect(hreflang).toContain(`x-default=${siteUrl}/en/articles/jep-512`)
    })

    test('robots.txt references the sitemap', async ({request}) => {
        const response = await request.get('/robots.txt')
        expect(response.status()).toBe(200)
        expect((await response.text()).toLowerCase()).toContain('sitemap')
    })
})
