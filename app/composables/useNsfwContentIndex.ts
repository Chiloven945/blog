import type {ArticleCardItem} from '#shared/types/article'
import type {NovelCardItem} from '#shared/types/novel'
import type {SeriesDocument} from '#shared/types/series'

export interface NsfwContentManifest {
    articles: ArticleCardItem[]
    novels: NovelCardItem[]
    series: SeriesDocument[]
}

type NsfwIndexStatus = 'idle' | 'loading' | 'ready' | 'error'

/**
 * Lightweight NSFW content metadata, fetched lazily from the gated
 * `/nsfw-data/content/<locale>.json` manifest. The manifest is loaded only
 * while the reader has opted in and the public computed values return `[]`
 * whenever the preference is off, so nothing leaks into default browsing.
 */
export function useNsfwContentIndex() {
    const {locale} = useI18n()
    const {enabled} = useNsfwPreferences()

    const statuses = useState<Record<string, NsfwIndexStatus>>('nsfw-content-status', () => ({}))
    const manifests = useState<Record<string, NsfwContentManifest>>(
        'nsfw-content-index',
        () => ({})
    )

    const status = computed<NsfwIndexStatus>(() =>
        statuses.value[locale.value] ?? 'idle'
    )

    const source = computed(() => manifests.value[locale.value])

    const articles = computed<ArticleCardItem[]>(() =>
        enabled.value
            ? (source.value?.articles ?? [])
            : []
    )
    const novels = computed<NovelCardItem[]>(() =>
        enabled.value
            ? (source.value?.novels ?? [])
            : []
    )
    const series = computed<SeriesDocument[]>(() =>
        enabled.value
            ? (source.value?.series ?? [])
            : []
    )

    async function ensureLoaded() {
        const code = locale.value

        if (!import.meta.client || !enabled.value) {
            return
        }

        if (statuses.value[code] === 'ready' || statuses.value[code] === 'loading') {
            return
        }

        statuses.value = {...statuses.value, [code]: 'loading'}

        try {
            const manifest = await $fetch<NsfwContentManifest>(
                `/nsfw-data/content/${code}.json`,
            )
            manifests.value = {...manifests.value, [code]: manifest}
            statuses.value = {...statuses.value, [code]: 'ready'}
        } catch (error) {
            statuses.value = {...statuses.value, [code]: 'error'}
            console.error('[nsfw] failed to load the NSFW content manifest', error)
        }
    }

    function clearActive() {
        const code = locale.value

        manifests.value = Object.fromEntries(
            Object.entries(manifests.value).filter(([key]) => key !== code),
        )
        statuses.value = Object.fromEntries(
            Object.entries(statuses.value).filter(([key]) => key !== code),
        )
    }

    // Load on opt-in (after hydration) and drop every cached manifest the
    // moment the preference is switched off, so nothing lingers in memory.
    if (import.meta.client) {
        watch(enabled, value => {
            if (value) {
                void ensureLoaded()
            } else {
                manifests.value = {}
                statuses.value = {}
            }
        }, {immediate: true})
    }

    return {
        status,
        articles,
        novels,
        series,
        ensureLoaded,
        clearActive,
    }
}
