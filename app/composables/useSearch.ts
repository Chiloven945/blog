import {
    type SearchResultItem,
    type SearchSection,
    searchSections,
    type SearchStatus,
} from '~/utils/search'

/**
 * Search sections for the active locale.
 * The index is a build-time static JSON asset fetched lazily on the first
 * search and cached per locale, so the browser never scans the Content
 * database. Scoring stays local.
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
        // The index is a build-time static JSON asset, so the browser never
        // initialises the Content database just to search.
        return await $fetch<SearchSection[]>(`/search-index/${code}.json`)
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
