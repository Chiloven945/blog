import type {ComputedRef} from 'vue'

export const contentCollections = {
    'zh-cn': {
        articles: 'articlesZhCn',
        novels: 'novelsZhCn',
        series: 'seriesZhCn',
        pages: 'pagesZhCn',
        nsfwArticles: 'nsfwArticlesZhCn',
        nsfwNovels: 'nsfwNovelsZhCn',
        nsfwSeries: 'nsfwSeriesZhCn',
    },
    'zh-tw': {
        articles: 'articlesZhTw',
        novels: 'novelsZhTw',
        series: 'seriesZhTw',
        pages: 'pagesZhTw',
        nsfwArticles: 'nsfwArticlesZhTw',
        nsfwNovels: 'nsfwNovelsZhTw',
        nsfwSeries: 'nsfwSeriesZhTw',
    },
    en: {
        articles: 'articlesEn',
        novels: 'novelsEn',
        series: 'seriesEn',
        pages: 'pagesEn',
        nsfwArticles: 'nsfwArticlesEn',
        nsfwNovels: 'nsfwNovelsEn',
        nsfwSeries: 'nsfwSeriesEn',
    },
} as const

export type ContentLocale = keyof typeof contentCollections

export type ArticleCollectionName = (typeof contentCollections)[ContentLocale]['articles']
export type NovelCollectionName = (typeof contentCollections)[ContentLocale]['novels']
export type SeriesCollectionName = (typeof contentCollections)[ContentLocale]['series']
export type PageCollectionName = (typeof contentCollections)[ContentLocale]['pages']
export type NsfwArticleCollectionName = (typeof contentCollections)[ContentLocale]['nsfwArticles']
export type NsfwNovelCollectionName = (typeof contentCollections)[ContentLocale]['nsfwNovels']
export type NsfwSeriesCollectionName = (typeof contentCollections)[ContentLocale]['nsfwSeries']

export interface ActiveContentCollection {
    articles: ArticleCollectionName
    novels: NovelCollectionName
    series: SeriesCollectionName
    pages: PageCollectionName
    nsfwArticles: NsfwArticleCollectionName
    nsfwNovels: NsfwNovelCollectionName
    nsfwSeries: NsfwSeriesCollectionName
}

export function resolveContentCollection(locale: string): ActiveContentCollection {
    return contentCollections[locale as ContentLocale] ?? contentCollections['zh-cn']
}

export function useActiveContentCollection(): ComputedRef<ActiveContentCollection> {
    const {locale} = useI18n()

    return computed(() => resolveContentCollection(locale.value))
}
