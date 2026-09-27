import {queryCollection} from '@nuxt/content/server'

type NsfwLocale = 'en' | 'zh-cn' | 'zh-tw'

interface NsfwLocaleCollections {
    articles: 'nsfwArticlesEn' | 'nsfwArticlesZhCn' | 'nsfwArticlesZhTw'
    novels: 'nsfwNovelsEn' | 'nsfwNovelsZhCn' | 'nsfwNovelsZhTw'
    series: 'nsfwSeriesEn' | 'nsfwSeriesZhCn' | 'nsfwSeriesZhTw'
}

const localeCollections: Record<NsfwLocale, NsfwLocaleCollections> = {
    en: {
        articles: 'nsfwArticlesEn',
        novels: 'nsfwNovelsEn',
        series: 'nsfwSeriesEn',
    },
    'zh-cn': {
        articles: 'nsfwArticlesZhCn',
        novels: 'nsfwNovelsZhCn',
        series: 'nsfwSeriesZhCn',
    },
    'zh-tw': {
        articles: 'nsfwArticlesZhTw',
        novels: 'nsfwNovelsZhTw',
        series: 'nsfwSeriesZhTw',
    },
}

/**
 * Build-time NSFW content manifest for one locale, emitted as a static JSON
 * asset at `/nsfw-data/content/<locale>.json`. The edge Worker only serves it
 * when the `blog_nsfw` preference cookie is set, so no Markdown body is needed.
 */
export default defineEventHandler(async event => {
    // For `[locale].json.ts` the router captures the segment under the
    // `locale.json` key and keeps the extension, so normalise both away.
    const rawLocale = getRouterParam(event, 'locale')
        ?? getRouterParam(event, 'locale.json')
        ?? ''
    const locale = rawLocale.replace(/\.json$/, '') as NsfwLocale

    if (!locale || !(locale in localeCollections)) {
        throw createError({statusCode: 404, statusMessage: 'Unknown locale'})
    }

    const collections = localeCollections[locale]

    const [articles, novels, series] = await Promise.all([
        queryCollection(event, collections.articles)
            .select(
                'path', 'title', 'description', 'date', 'updated', 'subtype',
                'status', 'tags', 'series', 'seriesOrder', 'cover', 'coverAlt',
                'featured'
            )
            .all(),
        queryCollection(event, collections.novels)
            .select(
                'path', 'title', 'description', 'date', 'updated', 'subtype',
                'status', 'tags', 'series', 'seriesOrder', 'cover', 'coverAlt',
                'featured'
            )
            .all(),
        queryCollection(event, collections.series)
            .select(
                'path', 'title', 'description', 'kind', 'status', 'cover',
                'coverAlt', 'tags', 'startDate', 'endDate', 'featured'
            )
            .all(),
    ])

    return {
        articles: articles.map(item => ({...item, nsfw: true})),
        novels: novels.map(item => ({...item, nsfw: true})),
        series: series.map(item => ({...item, nsfw: true})),
    }
})
