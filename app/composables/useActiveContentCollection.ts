import type {ComputedRef} from 'vue'

export const contentCollections = {
    'zh-cn': {
        articles: 'articlesZhCn',
        novels: 'novelsZhCn',
        series: 'seriesZhCn',
        pages: 'pagesZhCn',
    },
    'zh-tw': {
        articles: 'articlesZhTw',
        novels: 'novelsZhTw',
        series: 'seriesZhTw',
        pages: 'pagesZhTw',
    },
    en: {
        articles: 'articlesEn',
        novels: 'novelsEn',
        series: 'seriesEn',
        pages: 'pagesEn'
    },
} as const

export type ContentLocale = keyof typeof contentCollections

export type ArticleCollectionName = (typeof contentCollections)[ContentLocale]['articles']
export type NovelCollectionName = (typeof contentCollections)[ContentLocale]['novels']
export type SeriesCollectionName = (typeof contentCollections)[ContentLocale]['series']
export type PageCollectionName = (typeof contentCollections)[ContentLocale]['pages']

export interface ActiveContentCollection {
    articles: ArticleCollectionName
    novels: NovelCollectionName
    series: SeriesCollectionName
    pages: PageCollectionName
}

export function resolveContentCollection(locale: string): ActiveContentCollection {
    return contentCollections[locale as ContentLocale] ?? contentCollections['zh-cn']
}

export function useActiveContentCollection(): ComputedRef<ActiveContentCollection> {
    const {locale} = useI18n()

    return computed(() => resolveContentCollection(locale.value))
}
