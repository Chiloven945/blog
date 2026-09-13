import {access, readdir, readFile} from 'node:fs/promises'
import {basename, extname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {parse as parseYaml} from 'yaml'
import {articleSchema} from '../shared/schemas/article'
import {novelSchema} from '../shared/schemas/novel'
import {seriesSchema} from '../shared/schemas/series'
import {normalizeTagKey} from '../shared/utils/taxonomy'

const root = fileURLToPath(new URL('..', import.meta.url))
const contentDir = join(root, 'content')
const publicDir = join(root, 'public')

const LOCALES = ['zh-cn', 'zh-tw', 'en'] as const
type Locale = (typeof LOCALES)[number]
type Kind = 'article' | 'novel'

const FILENAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2}|Z)?)?$/
const ABSOLUTE_PATH_PATTERN = /^(?:\/Users\/|\/home\/|[A-Za-z]:[\\/]|\/mnt\/)/

interface Problem {
    level: 'error' | 'warning'
    message: string
    file: string
}

interface ContentEntry {
    kind: Kind
    slug: string
    locale: Locale
    file: string
    label: string
    data: Record<string, unknown>
}

const problems: Problem[] = []

function report(
    level: Problem['level'],
    file: string,
    message: string
): void {
    problems.push({level, file, message})
}

async function fileExists(path: string): Promise<boolean> {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}

async function walkMarkdown(dir: string): Promise<string[]> {
    let entries

    try {
        entries = await readdir(dir, {withFileTypes: true})
    } catch {
        return []
    }

    const files = await Promise.all(
        entries.map(entry => {
            const path = join(dir, entry.name)

            if (entry.isDirectory()) {
                return walkMarkdown(path)
            }

            return entry.isFile() && extname(entry.name) === '.md'
                ? [path]
                : []
        }),
    )

    return files.flat()
}

function parseFrontmatter(raw: string): Record<string, unknown> | null {
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)

    if (!match) {
        return null
    }

    const parsed = parseYaml(match[1])

    return parsed && typeof parsed === 'object'
        ? (parsed as Record<string, unknown>)
        : {}
}

async function validateEntry(entry: ContentEntry): Promise<void> {
    const {data, label} = entry
    const schema = entry.kind === 'article'
        ? articleSchema
        : novelSchema
    const result = schema.safeParse(data)

    if (!result.success) {
        for (const issue of result.error.issues) {
            report(
                'error',
                label,
                `schema: ${issue.path.join('.') || '(root)'} ${issue.message}`
            )
        }
    }

    for (const field of ['date', 'updated'] as const) {
        const value = data[field]

        if (typeof value === 'string'
            && !DATE_PATTERN.test(value)
        ) {
            report(
                'error',
                label,
                `${field} "${value}" is not an ISO date`
            )
        }
    }

    const cover = data.cover

    if (typeof cover === 'string' && cover.length > 0) {
        if (ABSOLUTE_PATH_PATTERN.test(cover)) {
            report(
                'error',
                label,
                `cover "${cover}" is a dangerous absolute local path`
            )
        } else if (cover.startsWith('/') && !(await fileExists(join(publicDir, cover)))) {
            report(
                'error',
                label,
                `cover "${cover}" does not exist under public/`
            )
        }
    }

    const series = data.series
    const seriesOrder = data.seriesOrder

    if (typeof series === 'string' && seriesOrder === undefined) {
        report(
            'error',
            label,
            `series "${series}" is set but seriesOrder is missing`
        )
    }

    if (seriesOrder !== undefined && typeof series !== 'string') {
        report(
            'error',
            label,
            'seriesOrder is set but series is missing'
        )
    }

    const tags = Array.isArray(data.tags)
        ? (data.tags as string[])
        : []
    const seenTags = new Map<string, string>()

    for (const tag of tags) {
        const normalized = normalizeTagKey(tag)
        const previous = seenTags.get(normalized)

        if (previous !== undefined) {
            report(
                'error',
                label,
                `duplicate tag "${tag}" (also "${previous}") after normalization`
            )
        } else {
            seenTags.set(normalized, tag)
        }
    }
}

async function main(): Promise<void> {
    const entriesByLocale = new Map<Locale, ContentEntry[]>()

    for (const locale of LOCALES) {
        const entries: ContentEntry[] = []

        for (const kind of ['article', 'novel'] as const) {
            const dir = join(
                contentDir,
                kind === 'article'
                    ? 'articles'
                    : 'novels',
                locale
            )

            for (const file of await walkMarkdown(dir)) {
                const slug = basename(file, '.md')
                const label = file.slice(root.length)
                entries.push({kind, slug, locale, file, label, data: {}})

                if (!FILENAME_PATTERN.test(slug)) {
                    report(
                        'error',
                        label,
                        `slug "${slug}" must match ${FILENAME_PATTERN}`
                    )
                }

                const raw = await readFile(file, 'utf8')
                const data = parseFrontmatter(raw)

                if (!data) {
                    report(
                        'error',
                        label,
                        'missing frontmatter block'
                    )
                    continue
                }

                entries[entries.length - 1]!.data = data
                await validateEntry(entries[entries.length - 1]!)
            }
        }

        entriesByLocale.set(locale, entries)
    }

    // Slug must be unique across article + novel within a locale.
    for (const locale of LOCALES) {
        const bySlug = new Map<string, Kind[]>()

        for (const entry of entriesByLocale.get(locale) ?? []) {
            const kinds = bySlug.get(entry.slug) ?? []
            kinds.push(entry.kind)
            bySlug.set(entry.slug, kinds)
        }

        for (const [slug, kinds] of bySlug) {
            if (kinds.length > 1) {
                report(
                    'error',
                    `content/{articles,novels}/${locale}/${slug}.md`,
                    `slug "${slug}" is used by ${kinds.length} entries (${kinds.join(', ')}) in ${locale}`,
                )
            }
        }
    }

    // Series existence, kind consistency, and seriesOrder uniqueness.
    const seriesByLocale = new Map<Locale, Map<string, Record<string, unknown>>>()

    for (const locale of LOCALES) {
        const map = new Map<string, Record<string, unknown>>()
        const dir = join(contentDir, 'series', locale)

        for (const file of await walkMarkdown(dir)) {
            const slug = basename(file, '.md')
            const label = file.slice(root.length)

            if (!FILENAME_PATTERN.test(slug)) {
                report(
                    'error',
                    label,
                    `slug "${slug}" must match ${FILENAME_PATTERN}`
                )
            }

            const data = parseFrontmatter(await readFile(file, 'utf8'))

            if (!data) {
                report(
                    'error',
                    label,
                    'missing frontmatter block'
                )
                continue
            }

            const result = seriesSchema.safeParse(data)

            if (!result.success) {
                for (const issue of result.error.issues) {
                    report(
                        'error',
                        label,
                        `schema: ${issue.path.join('.') || '(root)'} ${issue.message}`
                    )
                }
            }

            map.set(slug, data)
        }

        seriesByLocale.set(locale, map)
    }

    for (const locale of LOCALES) {
        const series = seriesByLocale.get(locale)
            ?? new Map<string, Record<string, unknown>>()
        const ordersBySeries = new Map<string, Map<number, string>>()

        for (const entry of entriesByLocale.get(locale) ?? []) {
            const slug = entry.data.series
            const order = entry.data.seriesOrder

            if (typeof slug !== 'string') {
                continue
            }

            const seriesEntry = series.get(slug)

            if (!seriesEntry) {
                report(
                    'error',
                    entry.label,
                    `series "${slug}" does not exist in ${locale}`
                )
                continue
            }

            if (seriesEntry.kind !== entry.kind) {
                report(
                    'error',
                    entry.label,
                    `series "${slug}" has kind "${String(seriesEntry.kind)}" but entry is a ${entry.kind}`,
                )
            }

            if (typeof order === 'number') {
                const orders = ordersBySeries.get(slug) ?? new Map<number, string>()
                const previous = orders.get(order)

                if (previous) {
                    report(
                        'error',
                        entry.label,
                        `series "${slug}" seriesOrder ${order} is already used by ${previous}`,
                    )
                } else {
                    orders.set(order, entry.slug)
                }
                ordersBySeries.set(slug, orders)
            }
        }
    }

    // Missing locale counterparts (content may be partial, but report it).
    const slugsByKind = new Map<string, Map<Locale, Set<string>>>()

    for (const locale of LOCALES) {
        for (const entry of entriesByLocale.get(locale) ?? []) {
            const key = entry.kind
            const byLocale = slugsByKind.get(key)
                ?? new Map<Locale, Set<string>>()
            const set = byLocale.get(locale) ?? new Set<string>()
            set.add(entry.slug)
            byLocale.set(locale, set)
            slugsByKind.set(key, byLocale)
        }
    }

    for (const [kind, byLocale] of slugsByKind) {
        const allSlugs = new Set([...byLocale.values()].flatMap(set => [...set]))

        for (const slug of allSlugs) {
            const missing = LOCALES.filter(locale =>
                !byLocale.get(locale)?.has(slug)
            )

            if (missing.length > 0) {
                report(
                    'warning',
                    `content/${kind === 'article'
                        ? 'articles'
                        : 'novels'}/*/${slug}.md`,
                    `missing in: ${missing.join(', ')} (partial translations are allowed)`,
                )
            }
        }
    }

    // Pages: filename charset only (body/SEO is handled elsewhere).
    for (const locale of LOCALES) {
        for (const file of await walkMarkdown(join(contentDir, 'pages', locale))) {
            const slug = basename(file, '.md')

            if (!FILENAME_PATTERN.test(slug)) {
                report(
                    'error',
                    file.slice(root.length),
                    `slug "${slug}" must match ${FILENAME_PATTERN}`
                )
            }
        }
    }

    const errors = problems.filter(problem => problem.level === 'error')
    const warnings = problems.filter(problem => problem.level === 'warning')

    for (const problem of problems) {
        const prefix = problem.level === 'error'
            ? 'error'
            : 'warn '
        console.log(`${prefix} ${problem.file}\n      ${problem.message}`)
    }

    console.log(`\ncontent:check — ${errors.length} error(s), ${warnings.length} warning(s)`)

    if (errors.length > 0) {
        process.exit(1)
    }
}

await main()
