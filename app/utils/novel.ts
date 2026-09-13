import {type NovelSubtype, novelSubtypes} from '#shared/config/novel-subtypes'
import {type NovelStatus, novelStatuses} from '#shared/config/statuses'

/** Resolve a novel subtype key to its config, or null when unknown. */
export function resolveNovelSubtype(subtype?: string) {
    if (!subtype) {
        return null
    }

    return novelSubtypes[subtype as NovelSubtype] ?? null
}

/** Resolve a novel status key to its config, defaulting to `complete`. */
export function resolveNovelStatus(status?: string) {
    return novelStatuses[(status ?? 'complete') as NovelStatus] ?? novelStatuses.complete
}

/** A novel is "in progress" when it is actively being written. */
export function isNovelInProgress(status?: string): boolean {
    return status === 'wip'
}

/**
 * Pick the novel to feature at the top of /novels. Prefers an explicitly
 * featured work, then the first in-progress serial, then the newest.
 */
export function pickNovelFeature<T extends {
    status?: string;
    featured?: boolean
}>(items: T[]): T | null {
    if (items.length === 0) {
        return null
    }

    return items.find(item => item.featured === true)
        ?? items.find(item => isNovelInProgress(item.status))
        ?? items[0]
        ?? null
}
