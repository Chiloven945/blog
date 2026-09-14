import {
    type SearchResultItem,
    type SearchSection,
    searchSections,
    type SearchStatus,
} from '~/utils/search'
import {resolveContentCollection} from '~/composables/useActiveContentCollection'

type RawSearchSection = {
    id?: unknown
    title?: unknown
    titles?: unknown
    level?: unknown
    content?: unknown
    subtype?: unknown
    status?: unknown
    tags?: unknown
    date?: unknown
}

function toStringArray(value: unknown): string[] | undefined {
    return Array.isArray(value)
        ? value.map(String)
        : undefined
}

function toSearchSection(
    raw: RawSearchSection,
    kind?: 'article' | 'novel'
): SearchSection {
    const id = typeof raw.id === 'string'
        ? raw.id
        : ''
    const hash = id.indexOf('#')

    return {
        id,
        path: hash === -1
            ? id
            : id.slice(0, hash),
        anchor: hash === -1
            ? undefined
            : id.slice(hash + 1),
        title: typeof raw.title === 'string'
            ? raw.title
            : '',
        titles: toStringArray(raw.titles) ?? [],
        level: typeof raw.level === 'number'
            ? raw.level
            : 1,
        content: typeof raw.content === 'string'
            ? raw.content
            : '',
        kind,
        subtype: typeof raw.subtype === 'string'
            ? raw.subtype
            : undefined,
        tags: toStringArray(raw.tags),
        date: typeof raw.date === 'string'
            ? raw.date
            : undefined,
    }
}

const extraFields = ['subtype', 'tags', 'date'] as const

/**
 * Search sections for the active locale.
 * The index is built lazily in the browser from the article + novel + pages
 * collections and scored locally with a simple first-version ranking.
 */
export function useSearch() {
    const {locale} = useI18n()

    // Locale is an explicit data dimension: one index per language, so
    // switching languages never reuses another locale's results.
    const statuses = useState<Record<string, SearchStatus>>('search-status', () => ({}))
    const indices = useState<Record<string, SearchSection[]>>('search-index', () => ({}))
    const query = ref('')

    const status = computed<SearchStatus>(() =>
        statuses.value[locale.value] ?? 'idle'
    )
    const sections = computed<SearchSection[]>(() =>
        indices.value[locale.value] ?? []
    )

    async function buildIndex(code: string): Promise<SearchSection[]> {
        // Resolve the collections from the requested locale explicitly, so an
        // index is always built from the language it is stored under, even if
        // the active locale changes while the queries are in flight.
        const collections = resolveContentCollection(code)
        const [articleSections, novelSections, pageSections] = await Promise.all([
            queryCollectionSearchSections(collections.articles, {
                minHeading: 'h2',
                maxHeading: 'h4',
                extraFields: [...extraFields],
            }),
            queryCollectionSearchSections(collections.novels, {
                minHeading: 'h2',
                maxHeading: 'h4',
                extraFields: [...extraFields],
            }),
            queryCollectionSearchSections(collections.pages, {
                minHeading: 'h2',
                maxHeading: 'h4',
            }),
        ])

        return [
            ...articleSections.map(section =>
                toSearchSection(section as unknown as RawSearchSection, 'article'),
            ),
            ...novelSections.map(section =>
                toSearchSection(section as unknown as RawSearchSection, 'novel'),
            ),
            ...pageSections.map(section =>
                toSearchSection(section as unknown as RawSearchSection),
            ),
        ]
    }

    async function ensureIndex() {
        const code = locale.value

        if (statuses.value[code] === 'ready' || statuses.value[code] === 'loading') {
            return
        }

        statuses.value = {...statuses.value, [code]: 'loading'}

        try {
            const built = await buildIndex(code)
            indices.value = {...indices.value, [code]: built}
            statuses.value = {...statuses.value, [code]: 'ready'}
        } catch (error) {
            statuses.value = {...statuses.value, [code]: 'error'}
            console.error('[search] failed to build the search index', error)
        }
    }

    const results = computed<SearchResultItem[]>(() =>
        searchSections(sections.value, query.value))

    return {
        query,
        results,
        sections,
        status,
        ensureIndex
    }
}
