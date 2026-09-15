import {readdirSync} from 'node:fs'
import {join} from 'node:path'

export const nsfwKinds = ['articles', 'novels', 'series'] as const
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
