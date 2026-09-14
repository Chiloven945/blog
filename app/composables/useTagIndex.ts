import type {ArticleCardItem} from '#shared/types/article'
import type {NovelCardItem} from '#shared/types/novel'
import {normalizeTagKey} from '#shared/utils/taxonomy'

export interface TaxonomyTag {
    key: string
    label: string
    count: number
    articles: number
    novels: number
}

const articleFields = [
    'path',
    'title',
    'description',
    'date',
    'updated',
    'subtype',
    'status',
    'tags',
    'series',
    'cover',
    'coverAlt',
    'featured',
] as const

const novelFields = [
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

/**
 * Per-locale tag index. Tags are locale-local: the same article written in
 * two languages can carry different tag labels, so nothing here is shared
 * across locales.
 */
export async function useTagIndex() {
    const active = useActiveContentCollection()
    const {locale} = useI18n()

    const {data} = await useAsyncData(
        () => `tag-index-${locale.value}`,
        async () => {
            const [articles, novels] = await Promise.all([
                applyPublicStatus(
                    queryCollection(active.value.articles).select(...articleFields)
                )
                    .order('date', 'DESC')
                    .all(),
                applyPublicStatus(
                    queryCollection(active.value.novels).select(...novelFields)
                )
                    .order('date', 'DESC')
                    .all(),
            ])

            return {
                articles: articles as unknown as ArticleCardItem[],
                novels: novels as unknown as NovelCardItem[],
            }
        },
        {default: () => ({articles: [], novels: []})},
    )

    const articles = computed(() => data.value?.articles ?? [])
    const novels = computed(() => data.value?.novels ?? [])

    const tags = computed<TaxonomyTag[]>(() => {
        const map = new Map<string, TaxonomyTag>()

        const add = (raw: string, kind: 'article' | 'novel') => {
            const key = normalizeTagKey(raw)

            if (!key) {
                return
            }

            const label = raw.normalize('NFKC').trim()
            const existing = map.get(key)

            if (existing) {
                existing.count += 1
                if (kind === 'article') {
                    existing.articles += 1
                } else {
                    existing.novels += 1
                }
            } else {
                map.set(key, {
                    key,
                    label,
                    count: 1,
                    articles: kind === 'article'
                        ? 1
                        : 0,
                    novels: kind === 'novel'
                        ? 1
                        : 0,
                })
            }
        }

        for (const article of articles.value) {
            for (const tag of article.tags ?? []) {
                add(tag, 'article')
            }
        }

        for (const novel of novels.value) {
            for (const tag of novel.tags ?? []) {
                add(tag, 'novel')
            }
        }

        return [...map.values()].sort((a, b) =>
            b.count - a.count || a.label.localeCompare(b.label),
        )
    })

    function hasTag(
        entry: { tags?: string[] },
        key: string
    ): boolean {
        return (entry.tags ?? []).some(tag => normalizeTagKey(tag) === key)
    }

    function tagEntries(key: string) {
        return {
            articles: articles.value.filter(entry => hasTag(entry, key)),
            novels: novels.value.filter(entry => hasTag(entry, key)),
        }
    }

    return {articles, novels, tags, tagEntries}
}
