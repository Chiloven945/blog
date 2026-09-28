import {readdirSync, readFileSync} from 'node:fs'
import {join} from 'node:path'
import {parse} from 'yaml'
import {normalizeTagKey} from '../shared/utils/taxonomy'

// Series detail pages are not implemented yet (the normal site has no series
// page either), so series content is migrated but not prerendered. Add
// 'series' back once `app/pages/nsfw/series/[slug].vue` exists.
export const nsfwKinds = ['articles', 'novels'] as const
export const nsfwLocales = ['en', 'zh-cn', 'zh-tw'] as const

/**
 * Derive the prerender routes for NSFW content.
 *
 * NSFW pages are never linked from normal HTML while the preference is off,
 * so `crawlLinks` cannot discover them. This helper only derives route paths
 * from the file layout; it does not parse Content frontmatter, and slugs stay
 * filename-derived so discovery is deterministic.
 */
export function discoverNsfwRoutes(root = process.cwd()): string[] {
    const routes: string[] = []

    for (const kind of nsfwKinds) {
        for (const locale of nsfwLocales) {
            const dir = join(root, 'content', 'nsfw', kind, locale)

            let entries: string[]

            try {
                entries = readdirSync(dir, {recursive: true, encoding: 'utf8'})
            } catch {
                continue
            }

            for (const entry of entries) {
                const relative = entry.replace(/\\/g, '/')

                if (!relative.endsWith('.md')) {
                    continue
                }

                const slug = relative.slice(0, -3)
                routes.push(`/${locale}/nsfw/${kind}/${slug}`)
            }
        }
    }

    return routes.sort()
}

function collectTagKeys(root: string, kind: string, locale: string): Set<string> {
    const keys = new Set<string>()
    const dir = join(root, 'content', kind, locale)

    let entries: string[]

    try {
        entries = readdirSync(dir, {recursive: true, encoding: 'utf8'})
    } catch {
        return keys
    }

    for (const entry of entries) {
        const relative = entry.replace(/\\/g, '/')

        if (!relative.endsWith('.md')) {
            continue
        }

        let raw: string

        try {
            raw = readFileSync(join(dir, entry), 'utf8')
        } catch {
            continue
        }

        const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)

        if (!match?.[1]) {
            continue
        }

        const data = parse(match[1]) as {tags?: unknown}

        if (!Array.isArray(data?.tags)) {
            continue
        }

        for (const tag of data.tags) {
            if (typeof tag !== 'string') {
                continue
            }

            const key = normalizeTagKey(tag)

            if (key) {
                keys.add(key)
            }
        }
    }

    return keys
}

/**
 * Tag pages that exist only in opt-in NSFW content. They resolve while the
 * preference is off (with an empty state and noindex) so an opted-in reader
 * can browse them, but they must stay out of the public sitemap.
 */
export function discoverNsfwOnlyTagRoutes(root = process.cwd()): string[] {
    const routes = new Set<string>()

    for (const locale of nsfwLocales) {
        const normal = new Set<string>()

        for (const kind of ['articles', 'novels']) {
            for (const key of collectTagKeys(root, kind, locale)) {
                normal.add(key)
            }
        }

        for (const kind of ['articles', 'novels']) {
            for (const key of collectTagKeys(root, join('nsfw', kind), locale)) {
                if (!normal.has(key)) {
                    routes.add(`/${locale}/tags/${encodeURIComponent(key)}`)
                }
            }
        }
    }

    return [...routes].sort()
}
