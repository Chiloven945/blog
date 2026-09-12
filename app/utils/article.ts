import {type ArticleSubtype, articleSubtypes} from '#shared/config/article-subtypes'

export interface ArticleLike {
    featured?: boolean
    date: string
}

/** Resolve an article subtype key to its config, or null when unknown. */
export function resolveArticleSubtype(subtype?: string) {
    if (!subtype) {
        return null
    }

    return articleSubtypes[subtype as ArticleSubtype] ?? null
}

/** Pick the featured article, falling back to the newest item. */
export function pickArticleFeature<T extends ArticleLike>(items: T[]): T | null {
    if (items.length === 0) {
        return null
    }

    return items.find(item => item.featured === true) ?? items[0] ?? null
}
