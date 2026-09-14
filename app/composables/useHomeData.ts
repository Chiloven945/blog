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
            applyPublicStatus(
                queryCollection(active.value.articles).select(...fields)
            )
                .order('date', 'DESC')
                .limit(LIMIT)
                .all(),
    )

    const novelsAsync = useAsyncData(
        () => `home-novels-${active.value.novels}`,
        () =>
            applyPublicStatus(
                queryCollection(active.value.novels).select(...fields)
            )
                .order('date', 'DESC')
                .limit(LIMIT)
                .all(),
    )

    const {data: articlesData} = await articlesAsync
    const {data: novelsData} = await novelsAsync

    const latestArticles = computed(() =>
        (articlesData.value ?? []) as unknown as ArticleCardItem[],
    )

    const latestNovels = computed(() =>
        (novelsData.value ?? []) as unknown as NovelCardItem[],
    )

    return {latestArticles, latestNovels}
}
