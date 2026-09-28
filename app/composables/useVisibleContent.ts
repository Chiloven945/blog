import type {Ref} from 'vue'
import type {ArticleCardItem} from '#shared/types/article'
import type {NovelCardItem} from '#shared/types/novel'

/** Merge normal + opt-in NSFW items and order them newest-first. */
export function mergeVisibleContent<T extends { date: string }>(
    normal: readonly T[],
    nsfw: readonly T[],
): T[] {
    return [...normal, ...nsfw].sort((a, b) =>
        (b.date ?? '').localeCompare(a.date ?? ''),
    )
}

/** Articles visible to the reader: normal items plus opt-in NSFW metadata. */
export function useVisibleArticles(normal: Ref<ArticleCardItem[]>) {
    const {articles: nsfwArticles} = useNsfwContentIndex()

    return computed<ArticleCardItem[]>(() =>
        mergeVisibleContent(normal.value, nsfwArticles.value),
    )
}

/** Novels visible to the reader: normal items plus opt-in NSFW metadata. */
export function useVisibleNovels(normal: Ref<NovelCardItem[]>) {
    const {novels: nsfwNovels} = useNsfwContentIndex()

    return computed<NovelCardItem[]>(() =>
        mergeVisibleContent(normal.value, nsfwNovels.value),
    )
}
