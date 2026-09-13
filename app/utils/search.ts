export interface SearchSection {
    id: string
    path: string
    anchor?: string
    title: string
    titles: string[]
    level: number
    content: string
    kind?: 'article' | 'novel'
    subtype?: string
    tags?: string[]
    date?: string
}

export interface SearchResultItem extends SearchSection {
    score: number
    snippet: string
}

export type SearchStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface HighlightSegment {
    text: string
    match: boolean
}

export function tokenizeSearchQuery(query: string): string[] {
    return query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
}

function joinMetadata(section: SearchSection): string {
    return [
        section.kind,
        section.subtype,
        ...(section.tags ?? [])
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
}

/**
 * Simple first-version score:
 * title exact / prefix > title contains > heading > body > metadata.
 * All terms must appear somewhere in the section.
 */
export function scoreSearchSection(
    section: SearchSection,
    terms: string[]
): number {
    if (!terms.length) {
        return 0
    }

    const title = section.title.toLowerCase()
    const headings = section.titles.join(' ').toLowerCase()
    const content = section.content.toLowerCase()
    const metadata = joinMetadata(section)

    let score = 0

    for (const term of terms) {
        const inTitle = title.includes(term)
        const inHeadings = headings.includes(term)
        const inContent = content.includes(term)
        const inMetadata = metadata.includes(term)

        if (!inTitle && !inHeadings && !inContent && !inMetadata) {
            return 0
        }

        if (title === term) {
            score += 1000
        } else if (title.startsWith(term)) {
            score += 500
        } else if (inTitle) {
            score += 250
        }

        if (inHeadings) {
            score += 100
        }

        if (inContent) {
            score += 50
        }

        if (inMetadata) {
            score += 25
        }
    }

    return score + Math.max(0, 6 - section.level) * 10
}

export function buildSnippet(
    content: string,
    terms: string[],
    around = 48
): string {
    const text = content.replace(/\s+/g, ' ').trim()

    if (!text) {
        return ''
    }

    const lower = text.toLowerCase()
    let index = -1
    let matched = ''

    for (const term of terms) {
        const found = lower.indexOf(term)

        if (found !== -1 && (index === -1 || found < index)) {
            index = found
            matched = term
        }
    }

    if (index === -1) {
        return text.length > around * 2
            ? `${text.slice(0, around * 2).trim()}…`
            : text
    }

    const start = Math.max(0, index - around)
    const end = Math.min(text.length, index + matched.length + around)

    return `${start > 0
        ? '…'
        : ''}${text.slice(start, end).trim()}${end < text.length
        ? '…'
        : ''}`
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlightSegments(
    text: string,
    terms: string[]
): HighlightSegment[] {
    if (!text) {
        return []
    }

    const normalizedTerms = terms.filter(Boolean)

    if (!normalizedTerms.length) {
        return [{text, match: false}]
    }

    const pattern = new RegExp(
        `(${normalizedTerms.map(escapeRegExp).join('|')})`,
        'gi'
    )

    return text
        .split(pattern)
        .filter(part => part !== '')
        .map(part => ({
            text: part,
            match: normalizedTerms.some(term =>
                part.toLowerCase() === term.toLowerCase()
            ),
        }))
}

export function searchSections(
    sections: readonly SearchSection[],
    query: string,
    limit = 30,
): SearchResultItem[] {
    const terms = tokenizeSearchQuery(query)

    if (!terms.length) {
        return []
    }

    const scored: SearchResultItem[] = []

    for (const section of sections) {
        const score = scoreSearchSection(section, terms)

        if (score > 0) {
            scored.push({
                ...section,
                score,
                snippet: buildSnippet(section.content, terms),
            })
        }
    }

    scored.sort((a, b) =>
        b.score - a.score || a.level - b.level
    )

    return scored.slice(0, limit)
}
