import type {ComputedRef} from 'vue'
import {type Kind, kinds} from '#shared/config/kinds'

export interface KindOption {
    value: Kind
    label: string
    icon: string
}

export function useKinds(): ComputedRef<KindOption[]> {
    const {t} = useI18n()

    return computed(() =>
        (Object.entries(kinds) as Array<[Kind, (typeof kinds)[Kind]]>).map(([value, config]) => (
            {
                value,
                label: t(config.labelKey),
                icon: config.icon,
            }
        )),
    )
}
