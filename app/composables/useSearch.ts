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
    type?: unknown
    categories?: unknown
    tags?: unknown
    date?: unknown
}

function toStringArray(value: unknown): string[] | undefined {
    return Array.isArray(value) ? value.map(String) : undefined
}

function toSearchSection(raw: RawSearchSection): SearchSection {
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
        type: typeof raw.type === 'string' ? raw.type : undefined,
        categories: toStringArray(raw.categories),
        tags: toStringArray(raw.tags),
        date: typeof raw.date === 'string' ? raw.date : undefined,
    }
}

/**
 * Search sections for the active locale.
 * The index is built lazily in the browser from the posts + pages collections
 * and scored locally with a simple first-version ranking.
 */
export function useSearch() {
    const {locale} = useI18n()
    const active = useActiveContentCollection()

    const status = useState<SearchStatus>(`search-status-${locale.value}`, () => 'idle')
    const sections = useState<SearchSection[]>(`search-index-${locale.value}`, () => [])
    const query = ref('')

    async function buildIndex(): Promise<SearchSection[]> {
        const postsCollection = active.value.posts
        const pagesCollection = active.value.pages

        const [postSections, pageSections] = await Promise.all([
            queryCollectionSearchSections(postsCollection, {
                minHeading: 'h2',
                maxHeading: 'h4',
                extraFields: ['type', 'categories', 'tags', 'date'],
            }),
            queryCollectionSearchSections(pagesCollection, {
                minHeading: 'h2',
                maxHeading: 'h4',
            }),
        ])

        return [
            ...postSections.map(section => toSearchSection(section as unknown as RawSearchSection)),
            ...pageSections.map(section => toSearchSection(section as unknown as RawSearchSection)),
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

    const results = computed<SearchResultItem[]>(() => searchSections(sections.value, query.value))

    return {query, results, sections, status, ensureIndex}
}
