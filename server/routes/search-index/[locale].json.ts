import {queryCollectionSearchSections} from '@nuxt/content/server'

type SearchLocale = 'en' | 'zh-cn' | 'zh-tw'

interface LocaleCollections {
    articles: 'articlesEn' | 'articlesZhCn' | 'articlesZhTw'
    novels: 'novelsEn' | 'novelsZhCn' | 'novelsZhTw'
    pages: 'pagesEn' | 'pagesZhCn' | 'pagesZhTw'
}

const localeCollections: Record<SearchLocale, LocaleCollections> = {
    en: {
        articles: 'articlesEn',
        novels: 'novelsEn',
        pages: 'pagesEn',
    },
    'zh-cn': {
        articles: 'articlesZhCn',
        novels: 'novelsZhCn',
        pages: 'pagesZhCn',
    },
    'zh-tw': {
        articles: 'articlesZhTw',
        novels: 'novelsZhTw',
        pages: 'pagesZhTw',
    },
}

const extraFields = ['subtype', 'tags', 'date'] as const

type RawSearchSection = {
    id?: unknown
    title?: unknown
    titles?: unknown
    level?: unknown
    content?: unknown
    subtype?: unknown
    tags?: unknown
    date?: unknown
}

function toStringArray(value: unknown): string[] | undefined {
    return Array.isArray(value)
        ? value.map(String)
        : undefined
}

function toSearchSection(raw: RawSearchSection, kind?: 'article' | 'novel') {
    const id = typeof raw.id === 'string'
        ? raw.id
        : ''
    const hash = id.indexOf('#')

    return {
        id,
        path: hash === -1
            ? id
            : id.slice(0, hash),
        anchor: hash === -1
            ? undefined
            : id.slice(hash + 1),
        title: typeof raw.title === 'string'
            ? raw.title
            : '',
        titles: toStringArray(raw.titles) ?? [],
        level: typeof raw.level === 'number'
            ? raw.level
            : 1,
        content: typeof raw.content === 'string'
            ? raw.content
            : '',
        kind,
        subtype: typeof raw.subtype === 'string'
            ? raw.subtype
            : undefined,
        tags: toStringArray(raw.tags),
        date: typeof raw.date === 'string'
            ? raw.date
            : undefined,
    }
}

/**
 * Build-time search index for one locale, emitted as a static JSON asset at
 * `/search-index/<locale>.json` so the browser never scans the Content DB.
 */
export default defineEventHandler(async event => {
    // For `[locale].json.ts` the router captures the segment under the
    // `locale.json` key and keeps the extension, so normalise both away.
    const rawLocale = getRouterParam(event, 'locale')
        ?? getRouterParam(event, 'locale.json')
        ?? ''
    const locale = rawLocale.replace(/\.json$/, '') as SearchLocale

    if (!locale || !(locale in localeCollections)) {
        throw createError({statusCode: 404, statusMessage: 'Unknown locale'})
    }

    const collections = localeCollections[locale]

    const [articleSections, novelSections, pageSections] = await Promise.all([
        queryCollectionSearchSections(event, collections.articles, {
            minHeading: 'h2',
            maxHeading: 'h4',
            extraFields: [...extraFields],
        }),
        queryCollectionSearchSections(event, collections.novels, {
            minHeading: 'h2',
            maxHeading: 'h4',
            extraFields: [...extraFields],
        }),
        queryCollectionSearchSections(event, collections.pages, {
            minHeading: 'h2',
            maxHeading: 'h4',
        }),
    ])

    return [
        ...articleSections.map(section =>
            toSearchSection(section as unknown as RawSearchSection, 'article')
        ),
        ...novelSections.map(section =>
            toSearchSection(section as unknown as RawSearchSection, 'novel')
        ),
        ...pageSections.map(section =>
            toSearchSection(section as unknown as RawSearchSection)
        ),
    ]
})
