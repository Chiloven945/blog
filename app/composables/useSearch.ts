import {
    type SearchResultItem,
    type SearchSection,
    searchSections,
    type SearchStatus,
} from '~/utils/search'

type RawSearchSection = {
    id?: unknown
    title?: unknown
    titles?: unknown
    level?: unknown
    content?: unknown
    subtype?: unknown
    status?: unknown
    categories?: unknown
    tags?: unknown
    date?: unknown
}

function toStringArray(value: unknown): string[] | undefined {
    return Array.isArray(value) ? value.map(String) : undefined
}

function toSearchSection(
    raw: RawSearchSection,
    kind?: 'article' | 'novel'
): SearchSection {
    const id = typeof raw.id === 'string' ? raw.id : ''
    const hash = id.indexOf('#')

    return {
        id,
        path: hash === -1 ? id : id.slice(0, hash),
        anchor: hash === -1 ? undefined : id.slice(hash + 1),
        title: typeof raw.title === 'string' ? raw.title : '',
        titles: toStringArray(raw.titles) ?? [],
        level: typeof raw.level === 'number' ? raw.level : 1,
        content: typeof raw.content === 'string' ? raw.content : '',
        kind,
        subtype: typeof raw.subtype === 'string' ? raw.subtype : undefined,
        categories: toStringArray(raw.categories),
        tags: toStringArray(raw.tags),
        date: typeof raw.date === 'string' ? raw.date : undefined,
    }
}

const extraFields = ['subtype', 'categories', 'tags', 'date'] as const

/**
 * Search sections for the active locale.
 * The index is built lazily in the browser from the article + novel + pages
 * collections and scored locally with a simple first-version ranking.
 */
export function useSearch() {
    const {locale} = useI18n()
    const active = useActiveContentCollection()

    const status = useState<SearchStatus>(`search-status-${locale.value}`, () => 'idle')
    const sections = useState<SearchSection[]>(`search-index-${locale.value}`, () => [])
    const query = ref('')

    async function buildIndex(): Promise<SearchSection[]> {
        const [articleSections, novelSections, pageSections] = await Promise.all([
            queryCollectionSearchSections(active.value.articles, {
                minHeading: 'h2',
                maxHeading: 'h4',
                extraFields: [...extraFields],
            }),
            queryCollectionSearchSections(active.value.novels, {
                minHeading: 'h2',
                maxHeading: 'h4',
                extraFields: [...extraFields],
            }),
            queryCollectionSearchSections(active.value.pages, {
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
        if (status.value === 'ready' || status.value === 'loading') {
            return
        }

        status.value = 'loading'

        try {
            sections.value = await buildIndex()
            status.value = 'ready'
        } catch (error) {
            status.value = 'error'
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
