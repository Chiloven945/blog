import type {ComputedRef} from 'vue'
import type {LocaleObject} from '@nuxtjs/i18n'
import {contentCollections, type ContentLocale} from './useActiveContentCollection'

const localePrefixes: Record<ContentLocale, string> = {
    'zh-cn': '',
    'zh-tw': '/zh-tw',
    en: '/en',
}

const systemRoutes = new Set(['/', '/articles', '/novels', '/search', '/archives', '/friends'])

type ContentPathIndex = Record<string, string[]>

export interface LocaleOption {
    code: string
    name: string
    current: boolean
    available: boolean
    to: string
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

/** Build the target path for a locale from a locale-less relative path. */
export function localizedContentPath(
    relative: string,
    locale: ContentLocale
): string {
    const targetPrefix = localePrefixes[locale] ?? ''
    return locale === 'zh-cn' || relative === '/'
        ? relative
        : `${targetPrefix}${relative}`
}

export function useLocaleAvailability(): ComputedRef<LocaleOption[]> {
    const {locale, locales} = useI18n()
    const route = useRoute()
    const switchLocalePath = useSwitchLocalePath()

    const {data} = useAsyncData<ContentPathIndex>(
        'locale-content-paths',
        async () => {
            const codes = Object.keys(contentCollections) as ContentLocale[]
            const entries = await Promise.all(
                codes.map(async (code) => {
                    const collections = contentCollections[code]
                    const [articles, novels, series, pages] = await Promise.all([
                        queryCollection(collections.articles).select('path').all(),
                        queryCollection(collections.novels).select('path').all(),
                        queryCollection(collections.series).select('path').all(),
                        queryCollection(collections.pages).select('path').all(),
                    ])
                    const paths = [
                        ...articles,
                        ...novels,
                        ...series,
                        ...pages
                    ].map(item => (item as { path: string }).path,)
                    return [code, paths] as const
                }),
            )

            return Object.fromEntries(entries) as ContentPathIndex
        },
    )

    return computed(() => {
        const current = locale.value as ContentLocale
        const relative = stripLocalePrefix(route.path, current)
        const alwaysAvailable = systemRoutes.has(relative) || relative.startsWith('/dev')
        const index = data.value ?? {}

        return (locales.value as LocaleObject[]).map((item) => {
            const code = item.code as ContentLocale
            const targetPath = localizedContentPath(relative, code)
            const available = alwaysAvailable || (index[code] ?? []).includes(targetPath)

            return {
                code: item.code,
                name: item.name ?? item.code,
                current: item.code === current,
                available,
                to: switchLocalePath(item.code),
            }
        })
    })
}
