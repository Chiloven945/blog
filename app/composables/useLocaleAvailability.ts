import type {ComputedRef} from 'vue'
import type {LocaleObject} from '@nuxtjs/i18n'
import type {ContentLocale} from './useActiveContentCollection'

const localePrefixes: Record<ContentLocale, string> = {
    'zh-cn': '/zh-cn',
    'zh-tw': '/zh-tw',
    en: '/en',
}

const tagDetailPattern = /^\/tags\/[^/]+\/?$/

export interface LocaleOption {
    code: ContentLocale
    name: string
    current: boolean
    /** Path to open for this locale (tag detail falls back to the tag index). */
    to: string
    /** True when the current route is a locale-local tag detail page. */
    tagDetail: boolean
}

/** Remove the active locale prefix from a route path. */
export function stripLocalePrefix(
    path: string,
    locale: ContentLocale
): string {
    const prefix = localePrefixes[locale] ?? ''
    let relative = path

    if (prefix &&
        (relative === prefix || relative.startsWith(`${prefix}/`))
    ) {
        relative = relative.slice(prefix.length) || '/'
    }

    return relative.startsWith('/')
        ? relative
        : `/${relative}`
}

/**
 * Locale menu options. Translation parity is enforced at build time, so this
 * never queries Content to decide which locales are reachable; it only builds
 * the switch targets from the current route.
 */
export function useLocaleAvailability(): ComputedRef<LocaleOption[]> {
    const {locale, locales} = useI18n()
    const route = useRoute()
    const switchLocalePath = useSwitchLocalePath()

    return computed(() => {
        const current = locale.value as ContentLocale
        const relative = stripLocalePrefix(route.path, current)
        const tagDetail = tagDetailPattern.test(relative)

        return (locales.value as LocaleObject[]).map((item) => {
            const code = item.code as ContentLocale

            return {
                code,
                name: item.name ?? item.code,
                current: item.code === current,
                // Tags are locale-local, so a tag detail page switches to the
                // target locale's tag index instead of guessing a translation.
                to: tagDetail
                    ? `${localePrefixes[code] ?? ''}/tags`
                    : switchLocalePath(item.code),
                tagDetail,
            }
        })
    })
}
