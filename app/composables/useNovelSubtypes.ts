import type {ComputedRef} from 'vue'
import {type NovelSubtype, novelSubtypes} from '#shared/config/novel-subtypes'

export interface NovelSubtypeOption {
    value: NovelSubtype
    label: string
}

/** Localized novel subtype options for the /novels filter. */
export function useNovelSubtypes(): ComputedRef<NovelSubtypeOption[]> {
    const {t} = useI18n()

    return computed(() =>
        (Object.entries(novelSubtypes) as Array<[NovelSubtype, { labelKey: string }]>)
            .map(([value, config]) => ({
                value,
                label: t(config.labelKey),
            })),
    )
}
