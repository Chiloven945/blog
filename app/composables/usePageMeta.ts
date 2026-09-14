import {siteConfig} from '#shared/config/site'
import {useLocaleAvailability} from '~/composables/useLocaleAvailability'
import {resolveOgLocale} from '~/utils/locale'

type PageMetaType = 'website' | 'article'

interface PageMetaArticle {
    publishedTime?: MaybeRefOrGetter<string | undefined>
    modifiedTime?: MaybeRefOrGetter<string | undefined>
    tags?: MaybeRefOrGetter<string[] | undefined>
}

interface PageMetaOptions {
    title?: MaybeRefOrGetter<string | undefined>
    description?: MaybeRefOrGetter<string | undefined>
    type?: MaybeRefOrGetter<PageMetaType | undefined>
    image?: MaybeRefOrGetter<string | undefined>
    article?: PageMetaArticle
}

const HREFLANG: Record<string, string> = {
    'zh-cn': 'zh-CN',
    'zh-tw': 'zh-TW',
    en: 'en',
}

const DEFAULT_OG_IMAGE = '/images/social/og-default.png'

export function usePageMeta(options: PageMetaOptions = {}) {
    const route = useRoute()
    const availability = useLocaleAvailability()

    const siteUrl = siteConfig.domain.replace(/\/+$/, '')

    function absolute(path?: string) {
        if (!path) {
            return undefined
        }

        if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) {
            return path
        }

        return `${siteUrl}${path.startsWith('/')
            ? path
            : `/${path}`}`
    }

    const canonical = computed(() => {
        const path = route.path.replace(/\/+$/, '') || '/'
        return `${siteUrl}${path}`
    })

    const title = computed(() => toValue(options.title))
    const description = computed(() => toValue(options.description))
    const type = computed<PageMetaType>(() => toValue(options.type) ?? 'website')
    const image = computed(() => absolute(toValue(options.image)) ?? absolute(DEFAULT_OG_IMAGE))

    const alternates = computed(() => {
        const links: Array<{ rel: 'alternate'; type: string; hreflang: string; href: string }> = []

        for (const item of availability.value) {
            if (!item.available) {
                continue
            }

            links.push({
                rel: 'alternate',
                type: 'text/html',
                hreflang: HREFLANG[item.code] ?? item.code,
                href: `${siteUrl}${item.to}`,
            })
        }

        const xDefault =
            availability.value.find(item => item.code === siteConfig.defaultLocale && item.available) ??
            availability.value.find(item => item.available)

        if (xDefault) {
            links.push({
                rel: 'alternate',
                type: 'text/html',
                hreflang: 'x-default',
                href: `${siteUrl}${xDefault.to}`,
            })
        }

        return links
    })

    // Advertise the other available translations to social crawlers. The
    // active locale itself is emitted once as `og:locale` by app.vue.
    const ogLocaleAlternates = computed(() =>
        availability.value
            .filter(item => !item.current && item.available)
            .map(item => ({
                property: 'og:locale:alternate',
                content: resolveOgLocale(item.code),
            })),
    )

    useSeoMeta({
        title,
        description,
        ogTitle: title,
        ogDescription: description,
        ogType: type,
        ogUrl: canonical,
        ogImage: image,
        ogSiteName: siteConfig.name,
        twitterCard: 'summary_large_image',
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: image,
        articlePublishedTime: () => toValue(options.article?.publishedTime),
        articleModifiedTime: () => toValue(options.article?.modifiedTime),
        articleTag: () => toValue(options.article?.tags),
    })

    useHead(() => ({
        link: [
            {rel: 'canonical' as const, href: canonical.value},
            ...alternates.value.map(item => ({
                rel: 'alternate' as const,
                type: item.type,
                hreflang: item.hreflang,
                href: item.href,
            })),
        ],
        meta: ogLocaleAlternates.value,
    }))
}
