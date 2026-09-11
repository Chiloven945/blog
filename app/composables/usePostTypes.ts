import type {ComputedRef} from 'vue'
import {type PostType, postTypes} from '#shared/config/post-types'

export interface PostTypeOption {
    value: PostType
    label: string
    icon: string
}

export function usePostTypes(): ComputedRef<PostTypeOption[]> {
    const {t} = useI18n()

    return computed(() =>
        (Object.entries(postTypes) as Array<[PostType, (typeof postTypes)[PostType]]>).map(
            ([value, config]) => ({
                value,
                label: t(config.labelKey),
                icon: config.icon,
            }),
        ),
    )
}
