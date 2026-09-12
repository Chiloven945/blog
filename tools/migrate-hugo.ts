import {access, copyFile, mkdir, readdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, extname, join, relative} from 'node:path'
import {fileURLToPath} from 'node:url'
import {parse as parseYaml, stringify as stringifyYaml} from 'yaml'

const root = fileURLToPath(new URL('..', import.meta.url))
const contentDir = join(root, 'content')
const publicDir = join(root, 'public')

const LOCALES = ['zh-cn', 'zh-tw', 'en'] as const
type Locale = (typeof LOCALES)[number]

const args = process.argv.slice(2)

function hasFlag(name: string): boolean {
    return args.includes(`--${name}`)
}

function readOption(name: string, fallback: string): string {
    const inline = args.find(arg => arg.startsWith(`--${name}=`))

    if (inline) {
        return inline.slice(name.length + 3)
    }

    const index = args.indexOf(`--${name}`)

    return index >= 0 && args[index + 1] ? (args[index + 1] ?? fallback) : fallback
}

const dryRun = hasFlag('dry-run')
const force = hasFlag('force')
const sourceDir = join(root, readOption('source', '../Chiloven-Blog'))
const reportPath = join(root, readOption('report', 'migration-report.json'))

interface RawHtmlHit {
    file: string
    tag: string
    snippet: string
}

interface ReportEntry {
    kind: 'post' | 'cover' | 'friend' | 'link' | 'page' | 'ignored'
    locale?: Locale
    source?: string
    target?: string
    status: 'written' | 'planned' | 'skipped' | 'error'
    conversions: string[]
    rawHtml: string[]
    warnings: string[]
}

interface MigrationReport {
    generatedAt: string
    source: string
    dryRun: boolean
    force: boolean
    summary: {
        posts: number
        covers: number
        friends: number
        links: number
        pages: number
        skipped: number
        warnings: number
        errors: number
    }
    rawHtml: RawHtmlHit[]
    entries: ReportEntry[]
    warnings: string[]
    errors: string[]
}

const report: MigrationReport = {
    generatedAt: new Date().toISOString(),
    source: sourceDir,
    dryRun,
    force,
    summary: {
        posts: 0,
        covers: 0,
        friends: 0,
        links: 0,
        pages: 0,
        skipped: 0,
        warnings: 0,
        errors: 0
    },
    rawHtml: [],
    entries: [],
    warnings: [],
    errors: [],
}

function rel(path: string): string {
    return relative(root, path) || path
}

function addWarning(message: string): void {
    report.warnings.push(message)
}

function addError(message: string): void {
    report.errors.push(message)
}

function pushEntry(entry: Partial<ReportEntry> & Pick<ReportEntry, 'kind' | 'status'>): ReportEntry {
    const full: ReportEntry = {
        kind: entry.kind,
        status: entry.status,
        conversions: entry.conversions ?? [],
        rawHtml: entry.rawHtml ?? [],
        warnings: entry.warnings ?? [],
    }

    if (entry.locale) {
        full.locale = entry.locale
    }

    if (entry.source) {
        full.source = entry.source
    }

    if (entry.target) {
        full.target = entry.target
    }

    report.entries.push(full)

    return full
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

    return files.flat().sort()
}

interface ParsedFile {
    frontmatter: Record<string, unknown>
    body: string
}

function parseFile(raw: string): ParsedFile {
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)

    if (!match) {
        return {frontmatter: {}, body: raw}
    }

    const parsed = parseYaml(match[1] ?? '')

    return {
        frontmatter: parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {},
        body: raw.slice(match[0].length),
    }
}

function toArray(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.map(item => String(item))
    }

    return typeof value === 'string' && value.length > 0 ? [value] : []
}

function collapse(value: unknown): string {
    return String(value).replace(/\s+/g, ' ').trim()
}

function slugify(value: string): string {
    const ascii = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    return ascii || 'item'
}

function recordRawHtml(file: string, tag: string, snippet: string): void {
    report.rawHtml.push({file: rel(file), tag, snippet: snippet.slice(0, 160)})
}

interface NormalizeContext {
    file: string
    entry: ReportEntry
}

interface Segment {
    code: boolean
    text: string
}

// Split a Markdown body into fenced-code and prose segments so that HTML
// detection and rewriting never touches the contents of code blocks.
function splitSegments(body: string): Segment[] {
    const lines = body.split('\n')
    const segments: Segment[] = []
    let current: string[] = []
    let inFence = false

    const flush = (code: boolean): void => {
        if (current.length > 0) {
            segments.push({code, text: current.join('\n')})
            current = []
        }
    }

    for (const line of lines) {
        const isFence = /^\s*(```|~~~)/.test(line)

        if (isFence && !inFence) {
            flush(false)
            inFence = true
            current.push(line)
            continue
        }

        if (isFence && inFence) {
            current.push(line)
            flush(true)
            inFence = false
            continue
        }

        current.push(line)
    }

    flush(inFence)

    return segments
}

function normalizeBody(body: string, context: NormalizeContext): string {
    const note = (message: string): void => {
        context.entry.conversions.push(message)
    }

    const flagHtml = (snippet: string): void => {
        const tagMatch = /^<\s*\/?\s*([a-zA-Z][a-zA-Z0-9]*)/.exec(snippet)
        const tag = tagMatch?.[1]?.toLowerCase() ?? 'unknown'

        recordRawHtml(context.file, tag, snippet)
        context.entry.rawHtml.push(snippet.slice(0, 160))
    }

    function processProse(input: string): string {
        let output = input

        // Raw HTML tags, recorded before conversion so the report is complete.
        for (const match of output.matchAll(/<\/?[a-zA-Z][^>]*>/g)) {
            const snippet = match[0]

            // Autolinks such as <https://example.com> are Markdown, not HTML.
            if (/^<[a-z][a-z0-9+.-]*:\/\//i.test(snippet) || /^<\w+@\w/.test(snippet)) {
                continue
            }

            // Generics inside prose, e.g. <Integer> or <T>, are not HTML elements.
            if (/^<[A-Z][A-Za-z0-9]*>$/.test(snippet)) {
                continue
            }

            flagHtml(snippet)
        }

        // Spotify iframe -> MDC component (including inside a blockquote).
        output = output.replace(
            /(?:^[ \t]*>[ \t]*)?<iframe[^>]*src="([^"]*\bopen\.spotify\.com\/embed\/(playlist|album|track|episode|show|artist)\/([A-Za-z0-9]+)[^"]*)"[^>]*>\s*<\/iframe>/gm,
            (_full, _src, type: string, id: string) => {
                note(`spotify iframe -> ::spotify-embed (${type}:${id})`)
                return `::spotify-embed\n---\ntype: ${type}\nid: ${id}\n---\n::`
            },
        )

        // Linked images -> Markdown.
        output = output.replace(
            /<a\b[^>]*\bhref="([^"]+)"[^>]*>\s*<img\b[^>]*>\s*<\/a>/g,
            (full, href: string) => {
                const src = /\bsrc="([^"]+)"/.exec(full)?.[1]
                const alt = /\balt="([^"]*)"/.exec(full)?.[1] ?? ''

                if (!src) {
                    return full
                }

                note(`linked <img> -> Markdown image (${href})`)
                return `[![${alt}](${src})](${href})`
            },
        )

        // Bare images -> Markdown.
        output = output.replace(/<img\b[^>]*>/g, full => {
            const src = /\bsrc="([^"]+)"/.exec(full)?.[1]
            const alt = /\balt="([^"]*)"/.exec(full)?.[1] ?? ''

            if (!src) {
                return full
            }

            note(`<img> -> Markdown image (${src})`)
            return `![${alt}](${src})`
        })

        // Simple headings -> Markdown headings.
        output = output.replace(/<h([2-6])>([^<>]+)<\/h\1>/g, (_full, level: string, text: string) => {
            note(`<h${level}> -> Markdown heading`)
            return `${'#'.repeat(Number(level))} ${text.trim()}`
        })

        // Arbitrary anchors -> the M5 stable anchor form.
        output = output.replace(/<a\s+id="([^"]+)"\s*><\/a>/g, (_full, id: string) => {
            note(`<a id="${id}"> -> :span{#${id}}`)
            return `:span{#${id}}`
        })

        output = output.replace(/<a\s+id="([^"]+)"\s*>/g, (_full, id: string) => {
            note(`<a id="${id}"> -> :span{#${id}}`)
            return `:span{#${id}}`
        })

        // Drop structural wrappers that no longer have styling.
        output = output.replace(/<\/?div\b[^>]*>/gi, () => {
            note('dropped <div> wrapper')
            return ''
        })

        // Line breaks.
        output = output.replace(/^[ \t]*<br\s*\/?>[ \t]*$/gim, () => {
            note('<br> -> paragraph spacing')
            return ''
        })

        output = output.replace(/[ \t]*<br\s*\/?>/gi, () => {
            note('<br> -> hard line break')
            return '  \n'
        })

        return output
    }

    const joined = splitSegments(body.replace(/\r\n/g, '\n'))
        .map(segment => (segment.code ? segment.text : processProse(segment.text)))
        .join('\n')

    return joined.replace(/\n{3,}/g, '\n\n').trim()
}

interface BuiltFrontmatter {
    data: Record<string, unknown>
    coverSource?: string
    coverTarget?: string
    coverPublicPath?: string
}

function buildPostFrontmatter(
    frontmatter: Record<string, unknown>,
    type: 'article' | 'novel',
    slug: string,
    sourceFile: string,
): BuiltFrontmatter {
    const data: Record<string, unknown> = {}

    data.title = frontmatter.title ?? slug

    if (frontmatter.description) {
        data.description = collapse(frontmatter.description)
    }

    data.date = String(frontmatter.date)
    data.type = type
    data.categories = toArray(frontmatter.categories)
    data.tags = toArray(frontmatter.tags)

    const result: BuiltFrontmatter = {data}

    if (typeof frontmatter.image === 'string' && frontmatter.image.length > 0) {
        const extension = extname(frontmatter.image) || '.jpg'
        const coverSource = join(dirname(sourceFile), frontmatter.image)
        const coverPublicPath = `/images/posts/${slug}/cover${extension}`

        result.coverSource = coverSource
        result.coverTarget = join(publicDir, coverPublicPath)
        result.coverPublicPath = coverPublicPath
        data.cover = coverPublicPath
    }

    if (frontmatter.license) {
        data.license = String(frontmatter.license)
    }

    // Novels opt out of the table of contents (see post-types and the M4 fixtures).
    if (type === 'novel') {
        data.toc = false
    }

    if (frontmatter.comments === false) {
        data.comments = false
    }

    return result
}

async function writeText(target: string, data: string, entry: ReportEntry): Promise<void> {
    if (dryRun) {
        entry.status = 'planned'
        return
    }

    await mkdir(dirname(target), {recursive: true})
    await writeFile(target, data, 'utf8')
    entry.status = 'written'
}

async function copyAsset(source: string, target: string, entry: ReportEntry): Promise<void> {
    if (!(await fileExists(source))) {
        entry.warnings.push(`missing source asset: ${rel(source)}`)
        addWarning(`missing source asset: ${rel(source)}`)
        entry.status = 'error'
        return
    }

    if (dryRun) {
        entry.status = 'planned'
        return
    }

    await mkdir(dirname(target), {recursive: true})
    await copyFile(source, target)
    entry.status = 'written'
}

async function migratePosts(): Promise<void> {
    const sections: Array<{ dir: string; type: 'article' | 'novel' }> = [
        {dir: join(sourceDir, 'content', 'articles'), type: 'article'},
        {dir: join(sourceDir, 'content', 'novels'), type: 'novel'},
    ]
    const copiedCovers = new Set<string>()

    for (const section of sections) {
        const files = await walkMarkdown(section.dir)

        for (const file of files) {
            const name = file.slice(file.lastIndexOf('/') + 1)

            if (name.startsWith('_index.')) {
                pushEntry({kind: 'ignored', source: file, status: 'skipped'}).warnings.push(
                    'ignored as Hugo section metadata',
                )
                continue
            }

            const locale = LOCALES.find(candidate => name === `index.${candidate}.md`)

            if (!locale) {
                continue
            }

            const raw = await readFile(file, 'utf8')
            const {frontmatter, body} = parseFile(raw)
            const directoryName = dirname(file).slice(dirname(file).lastIndexOf('/') + 1)
            const slug = String(frontmatter.slug ?? directoryName)
            const entry = pushEntry({
                kind: 'post',
                locale,
                source: file,
                status: dryRun ? 'planned' : 'written'
            })

            if (frontmatter.slug && frontmatter.slug !== directoryName) {
                entry.warnings.push(`slug "${frontmatter.slug}" differs from directory "${directoryName}"`)
                addWarning(`${rel(file)}: slug "${frontmatter.slug}" differs from directory "${directoryName}"`)
            }

            if (typeof frontmatter.date !== 'string' || frontmatter.date.length === 0) {
                entry.warnings.push('missing date')
                addWarning(`${rel(file)}: missing date`)
            }

            const normalizedBody = normalizeBody(body, {file, entry})
            const built = buildPostFrontmatter(frontmatter, section.type, slug, file)
            const target = join(contentDir, 'posts', locale, `${slug}.md`)

            entry.target = target

            if ((await fileExists(target)) && !force) {
                entry.status = 'skipped'
                entry.warnings.push('target exists (use --force to overwrite)')
                report.summary.skipped += 1
                continue
            }

            // Drop the Hugo slug: the filename now carries it.
            const serialized = stringifyYaml(built.data, {lineWidth: 0}).trimEnd()
            const document = `---\n${serialized}\n---\n\n${normalizedBody}\n`

            await writeText(target, document, entry)
            report.summary.posts += 1

            if (built.coverSource && built.coverTarget && built.coverPublicPath) {
                // A cover is shared by every locale; copy it only once.
                if (copiedCovers.has(built.coverTarget)) {
                    continue
                }

                copiedCovers.add(built.coverTarget)

                const coverEntry = pushEntry({
                    kind: 'cover',
                    locale,
                    source: built.coverSource,
                    target: built.coverTarget,
                    status: dryRun ? 'planned' : 'written',
                })

                if ((await fileExists(built.coverTarget)) && !force) {
                    coverEntry.status = 'skipped'
                    coverEntry.warnings.push('target exists (use --force to overwrite)')
                } else {
                    await copyAsset(built.coverSource, built.coverTarget, coverEntry)
                    report.summary.covers += 1
                }
            }
        }
    }
}

async function readLocalePage(page: string, locale: Locale): Promise<ParsedFile | null> {
    const file = join(sourceDir, 'content', 'page', page, `index.${locale}.md`)

    if (!(await fileExists(file))) {
        return null
    }

    return parseFile(await readFile(file, 'utf8'))
}

interface FriendBuild {
    id: string
    name: string
    url: string
    avatar?: string
    description: Partial<Record<Locale, string>>
    order: number
}

async function migrateFriends(): Promise<void> {
    const perLocale = new Map<Locale, ParsedFile>()
    const images = new Set<string>()

    for (const locale of LOCALES) {
        const parsed = await readLocalePage('friends', locale)

        if (!parsed) {
            continue
        }

        perLocale.set(locale, parsed)

        const links = Array.isArray(parsed.frontmatter.links) ? parsed.frontmatter.links : []

        for (const link of links) {
            if (link && typeof link === 'object' && typeof (link as Record<string, unknown>).image === 'string') {
                images.add(String((link as Record<string, unknown>).image))
            }
        }
    }

    const primary = perLocale.get('zh-cn') ?? perLocale.get('zh-tw') ?? perLocale.get('en')

    if (!primary) {
        addError('friends page not found in the Hugo source')
        return
    }

    const referenceLinks = (primary.frontmatter.links as unknown[]) ?? []
    const items: FriendBuild[] = referenceLinks.map((link, index) => {
        const record = (link ?? {}) as Record<string, unknown>
        const url = String(record.website ?? '')
        const name = String(record.title ?? url)

        return {
            id: slugify(name),
            name,
            url,
            description: {},
            order: (index + 1) * 10,
        }
    })

    for (const locale of LOCALES) {
        const parsed = perLocale.get(locale)

        if (!parsed) {
            continue
        }

        const links = (parsed.frontmatter.links as unknown[]) ?? []

        links.forEach((link, index) => {
            const record = (link ?? {}) as Record<string, unknown>
            const target = items[index]

            if (!target) {
                return
            }

            target.description[locale] = String(record.description ?? '')

            if (locale === 'zh-cn' && typeof record.image === 'string') {
                const image = record.image

                if (/^https?:\/\//i.test(image)) {
                    target.avatar = image
                } else {
                    target.avatar = `/images/friends/${image}`
                }
            }
        })
    }

    for (const image of images) {
        if (/^https?:\/\//i.test(image)) {
            continue
        }

        const source = join(sourceDir, 'content', 'page', 'friends', image)
        const target = join(publicDir, 'images', 'friends', image)
        const entry = pushEntry({
            kind: 'friend',
            source,
            target,
            status: dryRun ? 'planned' : 'written'
        })

        await copyAsset(source, target, entry)
    }

    const friendsData = {
        items: items.map(item => {
            const entry: Record<string, unknown> = {
                id: item.id,
                name: item.name,
                url: item.url,
            }

            if (item.avatar) {
                entry.avatar = item.avatar
            }

            entry.description = item.description
            entry.order = item.order

            return entry
        }),
    }

    const target = join(contentDir, 'data', 'friends.yml')
    const entry = pushEntry({
        kind: 'friend',
        source: `${rel(sourceDir)}/content/page/friends`,
        target,
        status: dryRun ? 'planned' : 'written'
    })

    report.summary.friends = items.length

    if ((await fileExists(target)) && !force) {
        entry.status = 'skipped'
        entry.warnings.push('target exists (use --force to overwrite)')
        report.summary.skipped += 1
        return
    }

    await writeText(target, `${stringifyYaml(friendsData, {lineWidth: 0})}`, entry)
}

async function migrateLinks(): Promise<void> {
    const parsedByLocale = new Map<Locale, ParsedFile>()
    const localImages = new Set<string>()

    for (const locale of LOCALES) {
        const parsed = await readLocalePage('links', locale)

        if (!parsed) {
            continue
        }

        parsedByLocale.set(locale, parsed)

        const links = Array.isArray(parsed.frontmatter.links) ? parsed.frontmatter.links : []

        for (const link of links) {
            if (link && typeof link === 'object') {
                const image = (link as Record<string, unknown>).image

                if (typeof image === 'string' && image.length > 0 && !/^https?:\/\//i.test(image)) {
                    localImages.add(image)
                }
            }
        }
    }

    for (const image of localImages) {
        const source = join(sourceDir, 'content', 'page', 'links', image)
        const target = join(publicDir, 'images', 'links', image)
        const entry = pushEntry({
            kind: 'link',
            source,
            target,
            status: dryRun ? 'planned' : 'written'
        })

        await copyAsset(source, target, entry)
    }

    for (const locale of LOCALES) {
        const parsed = parsedByLocale.get(locale)

        if (!parsed) {
            continue
        }

        const title = String(parsed.frontmatter.title ?? 'Links')
        const links = Array.isArray(parsed.frontmatter.links) ? parsed.frontmatter.links : []

        const blocks = links.map(link => {
            const record = (link ?? {}) as Record<string, unknown>
            const lines = ['::link-card', '---', `href: ${String(record.website ?? '')}`, `title: ${JSON.stringify(String(record.title ?? ''))}`]

            if (record.description) {
                lines.push(`description: ${JSON.stringify(collapse(record.description))}`)
            }

            if (typeof record.image === 'string' && record.image.length > 0) {
                const image = /^https?:\/\//i.test(record.image)
                    ? record.image
                    : `/images/links/${record.image}`

                lines.push(`image: ${JSON.stringify(image)}`)
            }

            lines.push('---', '::')

            return lines.join('\n')
        })

        const body = `${blocks.join('\n\n')}\n`
        const navigation = {
            title,
            icon: 'i-lucide-link',
            order: 60,
        }

        const document = `---\n${stringifyYaml({
            title,
            navigation
        }, {lineWidth: 0}).trimEnd()}\n---\n\n${body}`
        const target = join(contentDir, 'pages', locale, 'links.md')
        const entry = pushEntry({
            kind: 'link',
            locale,
            source: `${rel(sourceDir)}/content/page/links/index.${locale}.md`,
            target,
            status: dryRun ? 'planned' : 'written'
        })

        report.summary.links += links.length

        if ((await fileExists(target)) && !force) {
            entry.status = 'skipped'
            entry.warnings.push('target exists (use --force to overwrite)')
            report.summary.skipped += 1
            continue
        }

        await writeText(target, document, entry)
    }
}

async function migrateAbout(): Promise<void> {
    for (const locale of LOCALES) {
        const parsed = await readLocalePage('about', locale)

        if (!parsed) {
            continue
        }

        const title = String(parsed.frontmatter.title ?? 'About')
        const entry = pushEntry({
            kind: 'page',
            locale,
            source: `${rel(sourceDir)}/content/page/about/index.${locale}.md`,
            status: dryRun ? 'planned' : 'written'
        })
        const body = normalizeBody(parsed.body, {
            file: join(sourceDir, 'content', 'page', 'about', `index.${locale}.md`),
            entry
        })
        const navigation = {
            title,
            icon: 'i-lucide-user',
            order: 50,
        }

        const document = `---\n${stringifyYaml({
            title,
            navigation
        }, {lineWidth: 0}).trimEnd()}\n---\n\n${body}\n`
        const target = join(contentDir, 'pages', locale, 'about.md')
        entry.target = target

        if ((await fileExists(target)) && !force) {
            entry.status = 'skipped'
            entry.warnings.push('target exists (use --force to overwrite)')
            report.summary.skipped += 1
            continue
        }

        await writeText(target, document, entry)
        report.summary.pages += 1
    }
}

async function migrateIgnored(): Promise<void> {
    for (const locale of LOCALES) {
        for (const page of ['archives', 'search']) {
            const file = join(sourceDir, 'content', 'page', page, `index.${locale}.md`)

            if (await fileExists(file)) {
                pushEntry({kind: 'ignored', locale, source: file, status: 'skipped'}).warnings.push(
                    `system page "${page}" is implemented in Vue; body not migrated`,
                )
            }
        }
    }
}

function finalize(): void {
    report.source = rel(sourceDir)

    for (const entry of report.entries) {
        if (entry.source?.startsWith('/')) {
            entry.source = rel(entry.source)
        }

        if (entry.target?.startsWith('/')) {
            entry.target = rel(entry.target)
        }
    }

    report.summary.warnings = report.warnings.length
    report.summary.errors = report.errors.length
}

async function main(): Promise<void> {
    if (!(await fileExists(sourceDir))) {
        console.error(`Hugo source not found: ${sourceDir}`)
        process.exit(1)
    }

    console.log(`${dryRun ? '[dry-run] ' : ''}Migrating Hugo source: ${sourceDir}`)

    await migratePosts()
    await migrateFriends()
    await migrateLinks()
    await migrateAbout()
    await migrateIgnored()
    finalize()

    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

    console.log(`posts:   ${report.summary.posts}`)
    console.log(`covers:  ${report.summary.covers}`)
    console.log(`friends: ${report.summary.friends}`)
    console.log(`links:   ${report.summary.links}`)
    console.log(`pages:   ${report.summary.pages}`)
    console.log(`skipped: ${report.summary.skipped}`)
    console.log(`warnings:${report.summary.warnings}`)
    console.log(`errors:  ${report.summary.errors}`)
    console.log(`report:  ${rel(reportPath)}`)

    if (report.summary.errors > 0) {
        process.exit(1)
    }
}

await main()
