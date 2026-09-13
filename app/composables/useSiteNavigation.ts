import type {ComputedRef} from 'vue'
import {siteNavigation} from '#shared/config/navigation'
import type {NavigationItem, SystemNavKey} from '#shared/types/navigation'
import {stripLocalePrefix} from '~/composables/useLocaleAvailability'

/** Localized primary navigation, sorted by configured order. */
export function useSiteNavigation(): ComputedRef<NavigationItem[]> {
    const {t} = useI18n()
    const localePath = useLocalePath()

    return computed(() =>
        siteNavigation
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(item => ({
                key: item.key,
                label: t(`nav.${item.key}`),
                to: localePath(item.to),
                icon: item.icon,
                available: item.available,
            })),
    )
}

/**
 * The navigation key for the current route. Articles and novels have
 * separate URL trees, so the active item is derived from the path itself.
 */
export function useActiveNavKey(): ComputedRef<SystemNavKey | null> {
    const {locale} = useI18n()
    const route = useRoute()

    const segments: Record<string, SystemNavKey> = {
        articles: 'articles',
        novels: 'novels',
        tags: 'tags',
        archives: 'archives',
        friends: 'friends',
    }

    return computed<SystemNavKey | null>(() => {
        const relative = stripLocalePrefix(route.path, locale.value)

        if (relative === '/') {
            return 'home'
        }

        const segment = relative.split('/').filter(Boolean)[0]
        return segment
            ? segments[segment] ?? null
            : null
    })
}
