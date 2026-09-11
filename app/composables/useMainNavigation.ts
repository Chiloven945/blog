import type {ComputedRef} from 'vue'
import {systemNavigation} from '#shared/config/navigation'
import type {CustomPageNavigation} from '#shared/types/content'
import type {NavigationItem} from '#shared/types/navigation'

interface ContentPageNavigationItem {
    path: string
    title: string
    navigation?: boolean | CustomPageNavigation
}

export function useMainNavigation(): ComputedRef<NavigationItem[]> {
    const {t} = useI18n()
    const localePath = useLocalePath()
    const active = useActiveContentCollection()

    const {data: pagesData} = useAsyncData(
        () => `main-navigation-${active.value.pages}`,
        () =>
            queryCollection(active.value.pages).select('path', 'title', 'navigation').all(),
    )

    return computed(() => {
        const system = systemNavigation
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(item => ({
                label: t(`nav.${item.key}`),
                to: localePath(item.to),
                icon: item.icon,
                order: item.order,
            }))

        const pages = ((pagesData.value ?? []) as ContentPageNavigationItem[])
            .filter(
                (page): page is ContentPageNavigationItem & { navigation: CustomPageNavigation } =>
                    typeof page.navigation === 'object' && page.navigation !== null,
            )
            .map(page => ({
                label: page.navigation.title ?? page.title,
                to: page.path,
                icon: page.navigation.icon,
                order: page.navigation.order ?? 50,
            }))
            .sort((a, b) => a.order - b.order)

        return [...system, ...pages].map(({label, to, icon}) => ({label, to, icon}))
    })
}
