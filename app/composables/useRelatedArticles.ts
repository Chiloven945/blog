import type {Ref} from 'vue'
import type {ArticleCardItem, ArticleDocument} from '#shared/types/article'
import {rankRelated} from '~/utils/related-score'

/**
 * Same-kind related articles (never novels), scored deterministically.
 * The query result is cached per locale; `current` only drives the ranking.
 */
export function useRelatedArticles(current: Ref<ArticleDocument | null>, limit = 3) {
    const active = useActiveContentCollection()

    const {data} = useAsyncData(
        () => `related-articles-${active.value.articles}`,
        () => queryCollection(active.value.articles)
            .select(
                'path',
                'title',
                'description',
                'date',
                'subtype',
                'status',
                'tags',
                'series',
                'cover',
                'coverAlt',
                'featured',
            )
            .order('date', 'DESC')
            .all(),
    )

    const related = computed<ArticleCardItem[]>(() => {
        const item = current.value

        if (!item) {
            return []
        }

        const items = filterDrafts((data.value ?? []) as unknown as ArticleCardItem[])

        return rankRelated(item, items, limit)
    })

    return {related}
}
