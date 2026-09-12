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
                    '/',
                    '/articles',
                    '/archives',
                    '/friends',
                    '/links',
                    '/about',
                    '/p/jep-401',
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
            'serves the RSS feed and its legacy alias',
            async ({request}) => {
                for (const path of ['/rss.xml', '/index.xml']) {
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

                for (const path of paths) {
                    const response = await request.get(path)
                    expect(response.status(), path).toBe(200)

                    const xml = await response.text()
                    expect(xml, path).not.toContain('/search')
                    expect(xml, path).toContain('/p/')
                }
            }
        )

        test(
            'emits canonical and hreflang links on posts',
            async ({page}) => {
                await gotoHydrated(page, '/p/jep-512')
                await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
                    'href',
                    `${siteUrl}/p/jep-512`,
                )

                const hreflang = await page.$$eval(
                    'link[rel=alternate][hreflang]',
                    links =>
                        links.map(link =>
                            `${link.getAttribute('hreflang')}=${link.getAttribute('href')}`
                        ),
                )
                expect(hreflang).toContain(`zh-CN=${siteUrl}/p/jep-512`)
                expect(hreflang).toContain(`en=${siteUrl}/en/p/jep-512`)
                expect(hreflang).toContain(`zh-TW=${siteUrl}/zh-tw/p/jep-512`)
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
