import type {ComputedRef} from 'vue'
import {systemNavigation} from '#shared/config/navigation'
import type {NavigationItem} from '#shared/types/navigation'

export function useMainNavigation(): ComputedRef<NavigationItem[]> {
    const {t} = useI18n()
    const localePath = useLocalePath()

    return computed(() =>
        systemNavigation
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(item => ({
                label: t(`nav.${item.key}`),
                to: localePath(item.to),
                icon: item.icon,
            })),
    )
}
