import type {ComputedRef} from 'vue'
import {type NovelStatus, novelStatuses} from '#shared/config/statuses'

export interface NovelStatusOption {
    value: NovelStatus
    label: string
}

/** Localized, publicly selectable novel statuses for the /novels filter. */
export function useNovelStatuses(): ComputedRef<NovelStatusOption[]> {
    const {t} = useI18n()

    return computed(() =>
        (Object.entries(novelStatuses) as Array<[
            NovelStatus, {
                labelKey: string;
                hidden?: boolean
            }
        ]>)
            .filter(([, config]) => !config.hidden)
            .map(([value, config]) => ({
                value,
                label: t(config.labelKey),
            })),
    )
}
