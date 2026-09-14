import {expect, test} from '@playwright/test'
import {gotoHydrated} from './helpers'

const siteUrl = 'https://www.chiloven.top'

test.describe(
    'internal links',
    () => {
        test(
            'every internal link returns 200',
            async ({page, request}) => {
                test.slow()

                const entries = [
                    '/zh-cn',
                    '/zh-cn/articles',
                    '/zh-cn/tags',
                    '/zh-cn/archives',
                    '/zh-cn/friends',
                    '/zh-cn/articles/jep-401',
                    '/zh-cn/novels/causerie-1',
                    '/en',
                    '/zh-tw',
                ]
                const urls = new Set<string>()

                for (const entry of entries) {
                    await page.goto(entry, {waitUntil: 'domcontentloaded'})
                    const hrefs = await page.$$eval(
                        'a[href]',
                        anchors =>
                            anchors.map(anchor =>
                                anchor.getAttribute('href') ?? ''
                            ),
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
            }
        )
    }
)

test.describe(
    'feeds and sitemap',
    () => {
        test(
            'serves a localized RSS feed per language',
            async ({request}) => {
                for (const path of ['/en/rss.xml', '/zh-cn/rss.xml', '/zh-tw/rss.xml']) {
                    const response = await request.get(path)
                    expect(response.status(), path).toBe(200)
                    expect(response.headers()['content-type'] ?? '', path).toContain('xml')

                    const body = await response.text()
                    expect(body, path).toContain('<rss')
                    expect(body, path).toContain('<item>')
                    expect(body, path).toContain(siteUrl)
                }
            }
        )

        test(
            'no longer serves an unprefixed feed',
            async ({request}) => {
                for (const path of ['/rss.xml', '/index.xml']) {
                    const response = await request.get(path)
                    expect(response.status(), path).toBe(404)
                }
            }
        )

        test(
            'serves a sitemap index with locale sitemaps',
            async ({request}) => {
                const index = await request.get('/sitemap_index.xml')
                expect(index.status()).toBe(200)

                const body = await index.text()
                expect(body).toContain('<sitemapindex')

                const paths = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
                    match => new URL(match[1]!).pathname,
                )
                expect(paths.length).toBeGreaterThan(0)

                const documents: string[] = []

                for (const path of paths) {
                    const response = await request.get(path)
                    expect(response.status(), path).toBe(200)

                    const xml = await response.text()
                    expect(xml, path).not.toContain('/search')
                    expect(xml, path).toContain('/articles/')
                    documents.push(xml)
                }

                const locs = [
                    ...documents.join('\n').matchAll(/<loc>([^<]+)<\/loc>/g),
                ].map(match => new URL(match[1]!).pathname)

                // All three locale canonicals are present for a representative
                // article and novel.
                for (const path of [
                    '/en/articles/jep-512',
                    '/zh-cn/articles/jep-512',
                    '/zh-tw/articles/jep-512',
                    '/en/novels/causerie-1',
                ]) {
                    expect(locs, path).toContain(path)
                }

                // No unprefixed dispatcher URL may enter the sitemap.
                const bare = locs.filter(
                    path => !/^\/(en|zh-cn|zh-tw)(\/|$)/.test(path),
                )
                expect(bare, 'unprefixed sitemap entries').toEqual([])
            }
        )

        test(
            'emits canonical and hreflang links on posts',
            async ({page}) => {
                await gotoHydrated(page, '/zh-cn/articles/jep-512')
                await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
                    'href',
                    `${siteUrl}/zh-cn/articles/jep-512`,
                )

                const hreflang = await page.$$eval(
                    'link[rel=alternate][hreflang]',
                    links =>
                        links.map(link =>
                            `${link.getAttribute('hreflang')}=${link.getAttribute('href')}`
                        ),
                )
                expect(hreflang).toContain(`zh-CN=${siteUrl}/zh-cn/articles/jep-512`)
                expect(hreflang).toContain(`en=${siteUrl}/en/articles/jep-512`)
                expect(hreflang).toContain(`zh-TW=${siteUrl}/zh-tw/articles/jep-512`)
                expect(hreflang).toContain(`x-default=${siteUrl}/en/articles/jep-512`)
            }
        )

        test(
            'emits a prefixed canonical and alternates on the home page',
            async ({page}) => {
                await gotoHydrated(page, '/en')

                await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
                    'href',
                    `${siteUrl}/en`,
                )

                const hreflang = await page.$$eval(
                    'link[rel=alternate][hreflang]',
                    links =>
                        links.map(link =>
                            `${link.getAttribute('hreflang')}=${link.getAttribute('href')}`
                        ),
                )
                expect(hreflang).toContain(`en=${siteUrl}/en`)
                expect(hreflang).toContain(`zh-CN=${siteUrl}/zh-cn`)
                expect(hreflang).toContain(`zh-TW=${siteUrl}/zh-tw`)
                expect(hreflang).toContain(`x-default=${siteUrl}/en`)

                const ogLocales = await page.$$eval(
                    'meta[property="og:locale:alternate"]',
                    metas => metas.map(meta => meta.getAttribute('content')),
                )
                expect(ogLocales).toContain('zh_CN')
                expect(ogLocales).toContain('zh_TW')
            }
        )

        test(
            'robots.txt points to the sitemap',
            async ({request}) => {
                const response = await request.get('/robots.txt')
                expect(response.status()).toBe(200)
                expect((await response.text()).toLowerCase()).toContain('sitemap')
            }
        )
    }
)
