import {access} from 'node:fs/promises'
import {join} from 'node:path'

const outputRoot = join(process.cwd(), '.output/public')
const locales = ['en', 'zh-cn', 'zh-tw'] as const

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
