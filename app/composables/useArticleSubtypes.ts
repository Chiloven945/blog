import type {ComputedRef} from 'vue'
import {type ArticleSubtype, articleSubtypes} from '#shared/config/article-subtypes'

export interface ArticleSubtypeOption {
    value: ArticleSubtype
    label: string
}

/** Localized article subtype options for the /articles filter. */
export function useArticleSubtypes(): ComputedRef<ArticleSubtypeOption[]> {
    const {t} = useI18n()

    return computed(() =>
        (Object.entries(articleSubtypes) as Array<[ArticleSubtype, { labelKey: string }]>)
            .map(([value, config]) => ({
                value,
                label: t(config.labelKey),
            })),
    )
}
