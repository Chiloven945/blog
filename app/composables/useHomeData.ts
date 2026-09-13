import type {ArticleCardItem} from '#shared/types/article'
import type {NovelCardItem} from '#shared/types/novel'

const LIMIT = 3

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
            queryCollection(active.value.articles)
                .select(...fields)
                .order('date', 'DESC')
                .all(),
    )

    const novelsAsync = useAsyncData(
        () => `home-novels-${active.value.novels}`,
        () =>
            queryCollection(active.value.novels)
                .select(...fields)
                .order('date', 'DESC')
                .all(),
    )

    const {data: articlesData} = await articlesAsync
    const {data: novelsData} = await novelsAsync

    const latestArticles = computed(() =>
        filterDrafts((articlesData.value ?? []) as unknown as ArticleCardItem[]).slice(0, LIMIT),
    )

    const latestNovels = computed(() =>
        filterDrafts((novelsData.value ?? []) as unknown as NovelCardItem[]).slice(0, LIMIT),
    )

    return {latestArticles, latestNovels}
}
