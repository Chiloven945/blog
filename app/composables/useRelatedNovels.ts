import type {Ref} from 'vue'
import type {NovelCardItem, NovelDocument} from '#shared/types/novel'
import {rankRelated} from '~/utils/related-score'

/**
 * Same-kind related novels (never articles), scored deterministically.
 * Novels do not fall back to chronological surround, so this is their main
 * content-discovery surface.
 */
export function useRelatedNovels(current: Ref<NovelDocument | null>, limit = 3) {
    const active = useActiveContentCollection()

    const {data} = useAsyncData(
        () => `related-novels-${active.value.novels}`,
        () => applyPublicStatus(
            queryCollection(active.value.novels)
                .select(
                    'path',
                    'title',
                    'description',
                    'date',
                    'subtype',
                    'status',
                    'tags',
                    'series',
                    'seriesOrder',
                    'cover',
                    'coverAlt',
                    'featured',
                )
        )
            .order('date', 'DESC')
            .all(),
    )

    const related = computed<NovelCardItem[]>(() => {
        const item = current.value

        if (!item) {
            return []
        }

        const items = (data.value ?? []) as unknown as NovelCardItem[]

        return rankRelated(item, items, limit)
    })

    return {related}
}
