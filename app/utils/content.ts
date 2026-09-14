import type {CollectionQueryBuilder} from '@nuxt/content'

export function isDraft(item: { status?: string }): boolean {
    return item.status === 'draft'
}

export function draftsEnabled(): boolean {
    return !import.meta.dev
        ? false
        : useRoute().query.drafts === '1'
}

/**
 * Apply the public visibility filter at the query layer. Local development can
 * still reveal drafts with `?drafts=1`; production and prerendering always hide
 * them, so pages never fetch drafts just to drop them in JavaScript.
 */
export function applyPublicStatus<T>(
    query: CollectionQueryBuilder<T>
): CollectionQueryBuilder<T> {
    return draftsEnabled()
        ? query
        : query.where('status', '<>', 'draft')
}
