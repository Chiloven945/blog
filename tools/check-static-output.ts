import {readFileSync} from 'node:fs'
import {access} from 'node:fs/promises'
import {join} from 'node:path'
import {discoverNsfwOnlyTagRoutes, discoverNsfwRoutes} from './discover-nsfw-routes'

const outputRoot = join(process.cwd(), '.output/public')
const locales = ['en', 'zh-cn', 'zh-tw'] as const
const nsfwRoutes = discoverNsfwRoutes()
const nsfwOnlyTagPaths = discoverNsfwOnlyTagRoutes()

// Deployment invariants: every indexable page is prerendered with an explicit
// locale prefix, and the deployment-only assets (feeds, search indexes,
// sitemap, robots, 404) are emitted too.
const mustExist = [
    ...locales.flatMap(locale => [
        `/${locale}/index.html`,
        `/${locale}/articles/index.html`,
        `/${locale}/novels/index.html`,
        `/${locale}/tags/index.html`,
        `/${locale}/archives/index.html`,
        `/${locale}/friends/index.html`,
        `/${locale}/search/index.html`,
        `/${locale}/dev/style/index.html`,
        `/${locale}/rss.xml`,
        `/search-index/${locale}.json`,
    ]),
    '/en/articles/jep-512/index.html',
    '/zh-cn/articles/jep-512/index.html',
    '/zh-tw/articles/jep-512/index.html',
    '/en/novels/causerie-2/index.html',
    '/zh-cn/novels/causerie-2/index.html',
    '/zh-tw/novels/causerie-2/index.html',
    // The NSFW article placeholder and the NSFW data endpoints are always
    // built.
    ...locales.flatMap(locale => [
        `/${locale}/nsfw/articles/nsfw-note/index.html`,
        `/nsfw-data/content/${locale}.json`,
        `/nsfw-data/search/${locale}.json`,
    ]),
    // Real NSFW works are local-only (gitignored), so their artifacts are
    // required only when the source is present, to keep a clean checkout
    // verifiable.
    ...nsfwRoutes.map(route => `${route}/index.html`),
    ...(nsfwRoutes.some(route => route.includes('/nsfw/novels/'))
        ? ['/nsfw-assets/novels/lambda/lambda.webp']
        : []),
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/robots.txt',
    '/404.html',
    '/200.html',
]

// Unprefixed paths are language-entry redirectors handled by the tiny Worker;
// they must never be emitted as standalone pages.
const mustNotExist = [
    '/index.html',
    '/articles/index.html',
    '/novels/index.html',
    '/tags/index.html',
    '/archives/index.html',
    '/friends/index.html',
    '/search/index.html',
    '/dev/style/index.html',
    // No series detail page is implemented yet.
    '/en/nsfw/series/index.html',
    '/zh-cn/nsfw/series/index.html',
    '/zh-tw/nsfw/series/index.html',
]

// Build-artifact privacy audit: the public index, feed, search, and sitemap
// files must contain no reference to NSFW content. Such references are only
// allowed inside the protected /nsfw/**, /nsfw-data/**, and /nsfw-assets/**
// namespaces.
const publicSurfaces = [
    ...locales.flatMap(locale => [
        `/${locale}/index.html`,
        `/${locale}/articles/index.html`,
        `/${locale}/novels/index.html`,
        `/${locale}/tags/index.html`,
        `/${locale}/archives/index.html`,
        `/${locale}/search/index.html`,
        `/${locale}/rss.xml`,
        `/search-index/${locale}.json`,
    ]),
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/robots.txt',
]

const nsfwMarkers = [
    '/nsfw/',
    'nsfw-note',
    'nsfw-sample',
    'lambda-intro',
    'lambda-chapter',
    'extra-2',
    'project-2',
    'wip-1',
    'wip-2',
    'NSFW Placeholder',
    '灰烬纪元',
    '百里之外的海边有谁',
    '小片段废稿堆积处',
    // NSFW-only tag pages must not appear in the public sitemap either.
    ...nsfwOnlyTagPaths,
    ...nsfwOnlyTagPaths.map(path => decodeURIComponent(path)),
]

async function exists(relativePath: string): Promise<boolean> {
    try {
        await access(join(outputRoot, relativePath))
        return true
    } catch {
        return false
    }
}

async function main() {
    const problems: string[] = []

    for (const path of mustExist) {
        if (!(await exists(path))) {
            problems.push(`missing: ${path}`)
        }
    }

    for (const path of mustNotExist) {
        if (await exists(path)) {
            problems.push(`should not exist: ${path}`)
        }
    }

    for (const path of publicSurfaces) {
        let text: string

        try {
            text = readFileSync(join(outputRoot, path), 'utf8')
        } catch {
            continue
        }

        for (const marker of nsfwMarkers) {
            if (text.includes(marker)) {
                problems.push(`nsfw leak: ${path} contains "${marker}"`)
            }
        }
    }

    if (problems.length) {
        console.error(`check:static — ${problems.length} problem(s)`)
        for (const problem of problems) {
            console.error(`  x ${problem}`)
        }
        process.exit(1)
    }

    console.log(`check:static — ${mustExist.length + mustNotExist.length} paths ok`)
}

await main()
