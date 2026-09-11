import {access, readdir, readFile} from 'node:fs/promises'
import {basename, extname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {parse as parseYaml} from 'yaml'
import {postTypes} from '../shared/config/post-types'
import {postSchema} from '../shared/types/content'

const root = fileURLToPath(new URL('..', import.meta.url))
const contentDir = join(root, 'content')
const publicDir = join(root, 'public')

const LOCALES = ['zh-cn', 'zh-tw', 'en'] as const

const FILENAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2}|Z)?)?$/
const ABSOLUTE_PATH_PATTERN = /^(?:\/Users\/|\/home\/|[A-Za-z]:[\\/]|\/mnt\/)/

interface Problem {
    level: 'error' | 'warning'
    message: string
    file: string
}

const problems: Problem[] = []

function report(level: Problem['level'], file: string, message: string): void {
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

            return entry.isFile() && extname(entry.name) === '.md' ? [path] : []
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

    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
}

async function validatePost(file: string, slug: string): Promise<void> {
    const label = file.slice(root.length)

    if (!FILENAME_PATTERN.test(slug)) {
        report('error', label, `slug "${slug}" must match ${FILENAME_PATTERN}`)
    }

    const raw = await readFile(file, 'utf8')
    const frontmatter = parseFrontmatter(raw)

    if (!frontmatter) {
        report('error', label, 'missing frontmatter block')
        return
    }

    const result = postSchema.safeParse(frontmatter)

    if (!result.success) {
        for (const issue of result.error.issues) {
            report('error', label, `schema: ${issue.path.join('.') || '(root)'} ${issue.message}`)
        }
    }

    const type = frontmatter.type

    if (typeof type === 'string' && !(type in postTypes)) {
        report('error', label, `unknown post type "${type}" (register it in postTypes)`)
    }

    for (const field of ['date', 'updated'] as const) {
        const value = frontmatter[field]

        if (typeof value === 'string' && !DATE_PATTERN.test(value)) {
            report('error', label, `${field} "${value}" is not an ISO date`)
        }
    }

    const cover = frontmatter.cover

    if (typeof cover === 'string' && cover.length > 0) {
        if (ABSOLUTE_PATH_PATTERN.test(cover)) {
            report('error', label, `cover "${cover}" is a dangerous absolute local path`)
        } else if (cover.startsWith('/') && !(await fileExists(join(publicDir, cover)))) {
            report('error', label, `cover "${cover}" does not exist under public/`)
        }
    }
}

async function main(): Promise<void> {
    const slugsByLocale = new Map<string, Set<string>>()

    for (const locale of LOCALES) {
        const dir = join(contentDir, 'posts', locale)
        const files = await walkMarkdown(dir)
        const slugs = new Set<string>()

        for (const file of files) {
            const slug = basename(file, '.md')

            if (slugs.has(slug)) {
                report('error', file.slice(root.length), `duplicate slug "${slug}" in ${locale}`)
            }

            slugs.add(slug)
            await validatePost(file, slug)
        }

        slugsByLocale.set(locale, slugs)
    }

    const allSlugs = new Set([...slugsByLocale.values()].flatMap(set => [...set]))

    for (const slug of allSlugs) {
        const missing = LOCALES.filter(locale => !slugsByLocale.get(locale)?.has(slug))

        if (missing.length > 0) {
            report(
                'warning',
                `content/posts/*/${slug}.md`,
                `missing in: ${missing.join(', ')} (partial translations are allowed)`,
            )
        }
    }

    for (const locale of LOCALES) {
        const files = await walkMarkdown(join(contentDir, 'pages', locale))

        for (const file of files) {
            const slug = basename(file, '.md')

            if (!FILENAME_PATTERN.test(slug)) {
                report('error', file.slice(root.length), `slug "${slug}" must match ${FILENAME_PATTERN}`)
            }
        }
    }

    const errors = problems.filter(problem => problem.level === 'error')
    const warnings = problems.filter(problem => problem.level === 'warning')

    for (const problem of problems) {
        const prefix = problem.level === 'error' ? 'error' : 'warn '
        console.log(`${prefix} ${problem.file}\n      ${problem.message}`)
    }

    console.log(`\ncontent:check — ${errors.length} error(s), ${warnings.length} warning(s)`)

    if (errors.length > 0) {
        process.exit(1)
    }
}

await main()
