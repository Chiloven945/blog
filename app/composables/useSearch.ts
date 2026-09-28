import {
    type SearchResultItem,
    type SearchSection,
    searchSections,
    type SearchStatus,
} from '~/utils/search'

/**
 * Search sections for the active locale.
 *
 * The normal index is a build-time static JSON asset fetched lazily on the
 * first search and cached per locale, so the browser never scans the Content
 * database. When the reader has opted in, the gated NSFW index is fetched
 * alongside it and merged into the visible sections; switching NSFW off drops
 * those sections immediately without reloading. Scoring stays local.
 */
export function useSearch() {
    const {locale} = useI18n()
    const {enabled} = useNsfwPreferences()

    // Locale is an explicit data dimension: one index per language, so
    // switching languages never reuses another locale's results.
    const statuses = useState<Record<string, SearchStatus>>('search-status', () => ({}))
    const indices = useState<Record<string, SearchSection[]>>('search-index', () => ({}))
    const nsfwStatuses = useState<Record<string, SearchStatus>>('nsfw-search-status', () => ({}))
    const nsfwIndices = useState<Record<string, SearchSection[]>>('nsfw-search-index', () => ({}))
    const query = ref('')

    const status = computed<SearchStatus>(() =>
        statuses.value[locale.value] ?? 'idle'
    )
    const nsfwStatus = computed<SearchStatus>(() =>
        nsfwStatuses.value[locale.value] ?? 'idle'
    )

    const normalSections = computed<SearchSection[]>(() =>
        indices.value[locale.value] ?? []
    )
    // Cached NSFW sections only ever surface while the preference is on.
    const nsfwSections = computed<SearchSection[]>(() =>
        enabled.value
            ? (nsfwIndices.value[locale.value] ?? [])
            : []
    )

    const sections = computed<SearchSection[]>(() => [
        ...normalSections.value,
        ...nsfwSections.value,
    ])

    async function loadIndex(code: string, nsfw: boolean): Promise<SearchSection[]> {
        const path = nsfw
            ? `/nsfw-data/search/${code}.json`
            : `/search-index/${code}.json`

        return await $fetch<SearchSection[]>(path)
    }

    async function ensureNormalIndex() {
        const code = locale.value

        if (statuses.value[code] === 'ready' || statuses.value[code] === 'loading') {
            return
        }

        statuses.value = {...statuses.value, [code]: 'loading'}

        try {
            const built = await loadIndex(code, false)
            indices.value = {...indices.value, [code]: built}
            statuses.value = {...statuses.value, [code]: 'ready'}
        } catch (error) {
            statuses.value = {...statuses.value, [code]: 'error'}
            console.error('[search] failed to build the search index', error)
        }
    }

    async function ensureNsfwIndex() {
        const code = locale.value

        if (!enabled.value) {
            return
        }

        if (nsfwStatuses.value[code] === 'ready' || nsfwStatuses.value[code] === 'loading') {
            return
        }

        nsfwStatuses.value = {...nsfwStatuses.value, [code]: 'loading'}

        try {
            const built = await loadIndex(code, true)
            nsfwIndices.value = {...nsfwIndices.value, [code]: built}
            nsfwStatuses.value = {...nsfwStatuses.value, [code]: 'ready'}
        } catch (error) {
            nsfwStatuses.value = {...nsfwStatuses.value, [code]: 'error'}
            console.error('[search] failed to build the NSFW search index', error)
        }
    }

    // Runs when Search opens (never at opt-in), keeping the heavier NSFW index
    // lazy. The normal index is always loaded.
    async function ensureIndex() {
        await ensureNormalIndex()

        if (enabled.value) {
            await ensureNsfwIndex()
        }
    }

    if (import.meta.client) {
        watch(enabled, value => {
            if (!value) {
                nsfwIndices.value = {}
                nsfwStatuses.value = {}
            }
        })
    }

    const results = computed<SearchResultItem[]>(() =>
        searchSections(sections.value, query.value))

    return {
        query,
        results,
        sections,
        status,
        nsfwStatus,
        ensureIndex
    }
}
