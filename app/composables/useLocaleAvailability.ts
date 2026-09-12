import type {ComputedRef} from 'vue'
import type {LocaleObject} from '@nuxtjs/i18n'
import {contentCollections, type ContentLocale} from './useActiveContentCollection'

const localePrefixes: Record<ContentLocale, string> = {
    'zh-cn': '',
    'zh-tw': '/zh-tw',
    en: '/en',
}

const systemRoutes = new Set(['/', '/blog', '/search', '/archives', '/friends'])

type ContentPathIndex = Record<string, string[]>

export interface LocaleOption {
    code: string
    name: string
    current: boolean
    available: boolean
    to: string
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
                    const [posts, pages] = await Promise.all([
                        queryCollection(collections.posts).select('path').all(),
                        queryCollection(collections.pages).select('path').all(),
                    ])
                    const paths = [...posts, ...pages].map(item => (item as { path: string }).path)
                    return [code, paths] as const
                }),
            )

            return Object.fromEntries(entries) as ContentPathIndex
        },
    )

    return computed(() => {
        const current = locale.value as ContentLocale
        const prefix = localePrefixes[current] ?? ''
        let relative = route.path

        if (prefix && (relative === prefix || relative.startsWith(`${prefix}/`))) {
            relative = relative.slice(prefix.length) || '/'
        }

        if (!relative.startsWith('/')) {
            relative = `/${relative}`
        }

        const alwaysAvailable = systemRoutes.has(relative) || relative.startsWith('/dev')
        const index = data.value ?? {}

        return (locales.value as LocaleObject[]).map((item) => {
            const code = item.code as ContentLocale
            const targetPrefix = localePrefixes[code] ?? ''
            const targetPath =
                code === 'zh-cn' || relative === '/' ? relative : `${targetPrefix}${relative}`
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
