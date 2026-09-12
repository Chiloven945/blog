import type {HomeData, PostCardItem} from '#shared/types/content'

interface HomeDocument extends HomeData {
    stem?: string
}

export async function useHomeData() {
    const {locale} = useI18n()
    const active = useActiveContentCollection()
    const postsCollection = computed(() => active.value.posts)

    const homeAsync = useAsyncData(
        () => `home-data-${locale.value}`,
        () => queryCollection('home').all() as unknown as Promise<HomeDocument[]>,
    )

    const postsAsync = useAsyncData(
        () => `home-writing-${postsCollection.value}`,
        () =>
            queryCollection(postsCollection.value)
                .select(
                    'path',
                    'title',
                    'description',
                    'date',
                    'type',
                    'categories',
                    'tags',
                    'cover',
                    'coverAlt',
                    'draft',
                )
                .order('date', 'DESC')
                .all(),
    )

    const {data: homeList} = await homeAsync
    const {data: posts} = await postsAsync

    const home = computed<HomeData | null>(() => {
        const list = homeList.value ?? []

        return list.find(item => item.stem?.endsWith(`/${locale.value}`)) ?? list[0] ?? null
    })

    const limit = computed(() => home.value?.writing?.limit ?? 3)

    const latestPosts = computed<PostCardItem[]>(() =>
        filterDrafts(posts.value ?? []).slice(0, limit.value),
    )

    return {home, latestPosts}
}
