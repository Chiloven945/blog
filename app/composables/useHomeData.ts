import type {ArticleCardItem} from '#shared/types/article'
import type {NovelCardItem} from '#shared/types/novel'

// Fetch headroom so that merging opt-in NSFW entries can still produce the
// correct newest top-N. The database query stays bounded.
const HOME_QUERY_LIMIT = 6
const HOME_RENDER_LIMIT = 3

/**
 * Homepage latest writing. Registers both async sources before the first
 * `await` so the Nuxt instance is still available (setup-context safety).
 */
export async function useHomeData() {
    const active = useActiveContentCollection()

    const fields = [
        'path',
        'title',
        'description',
        'date',
        'updated',
        'subtype',
        'status',
        'tags',
        'series',
        'seriesOrder',
        'cover',
        'coverAlt',
        'featured',
    ] as const

    const articlesAsync = useAsyncData(
        () => `home-articles-${active.value.articles}`,
        () =>
            applyPublicStatus(
                queryCollection(active.value.articles).select(...fields)
            )
                .order('date', 'DESC')
                .limit(HOME_QUERY_LIMIT)
                .all(),
    )

    const novelsAsync = useAsyncData(
        () => `home-novels-${active.value.novels}`,
        () =>
            applyPublicStatus(
                queryCollection(active.value.novels).select(...fields)
            )
                .order('date', 'DESC')
                .limit(HOME_QUERY_LIMIT)
                .all(),
    )

    const {articles: nsfwArticles} = useNsfwContentIndex()
    const {novels: nsfwNovels} = useNsfwContentIndex()

    const {data: articlesData} = await articlesAsync
    const {data: novelsData} = await novelsAsync

    const latestArticles = computed(() =>
        mergeVisibleContent(
            (articlesData.value ?? []) as unknown as ArticleCardItem[],
            nsfwArticles.value,
        ).slice(0, HOME_RENDER_LIMIT),
    )

    const latestNovels = computed(() =>
        mergeVisibleContent(
            (novelsData.value ?? []) as unknown as NovelCardItem[],
            nsfwNovels.value,
        ).slice(0, HOME_RENDER_LIMIT),
    )

    return {latestArticles, latestNovels}
}
