import type {HomeData, PostCardItem} from '#shared/types/content'

interface HomeDocument extends HomeData {
    stem?: string
}

export async function useHomeData() {
    const {locale} = useI18n()
    const active = useActiveContentCollection()

    const homeAsync = useAsyncData(
        () => `home-data-${locale.value}`,
        () => queryCollection('home').all() as unknown as Promise<HomeDocument[]>,
    )

    const postsAsync = useAsyncData(
        () => `home-writing-${active.value.articles}-${active.value.novels}`,
        async () => {
            const fields = [
                'path',
                'title',
                'description',
                'date',
                'subtype',
                'status',
                'categories',
                'tags',
                'cover',
                'coverAlt',
            ] as const

            const [articles, novels] = await Promise.all([
                queryCollection(active.value.articles)
                    .select(...fields)
                    .order('date', 'DESC')
                    .all(),
                queryCollection(active.value.novels)
                    .select(...fields)
                    .order('date', 'DESC')
                    .all(),
            ])

            return [
                ...articles.map(item => (
                    {...item, kind: 'article' as const}
                )),
                ...novels.map(item => (
                    {...item, kind: 'novel' as const}
                )),
            ]
        },
    )

    const {data: homeList} = await homeAsync
    const {data: posts} = await postsAsync

    const home = computed<HomeData | null>(() => {
        const list = homeList.value ?? []

        return list.find(item =>
            item.stem?.endsWith(`/${locale.value}`)
        ) ?? list[0] ?? null
    })

    const limit = computed(() => home.value?.writing?.limit ?? 3)

    const latestPosts = computed<PostCardItem[]>(() =>
        filterDrafts((posts.value ?? []) as PostCardItem[])
            .slice(0, limit.value),
    )

    return {home, latestPosts}
}
