import {defineCollection, defineContentConfig} from '@nuxt/content'
import {articleSchema} from './shared/schemas/article'
import {novelSchema} from './shared/schemas/novel'
import {seriesSchema} from './shared/schemas/series'
import {friendsSchema, homeSchema, pageSchema} from './shared/types/content'

const locales = {
    zhCn: {dir: 'zh-cn', prefix: '/p'},
    zhTw: {dir: 'zh-tw', prefix: '/zh-tw/p'},
    en: {dir: 'en', prefix: '/en/p'},
} as const

const seriesLocales = {
    zhCn: {dir: 'zh-cn', prefix: '/series'},
    zhTw: {dir: 'zh-tw', prefix: '/zh-tw/series'},
    en: {dir: 'en', prefix: '/en/series'},
} as const

export default defineContentConfig({
    collections: {
        articlesZhCn: defineCollection({
            type: 'page',
            source: {
                include: `articles/${locales.zhCn.dir}/**/*.md`,
                prefix: locales.zhCn.prefix
            },
            schema: articleSchema,
        }),
        articlesZhTw: defineCollection({
            type: 'page',
            source: {
                include: `articles/${locales.zhTw.dir}/**/*.md`,
                prefix: locales.zhTw.prefix
            },
            schema: articleSchema,
        }),
        articlesEn: defineCollection({
            type: 'page',
            source: {
                include: `articles/${locales.en.dir}/**/*.md`,
                prefix: locales.en.prefix
            },
            schema: articleSchema,
        }),

        novelsZhCn: defineCollection({
            type: 'page',
            source: {
                include: `novels/${locales.zhCn.dir}/**/*.md`,
                prefix: locales.zhCn.prefix
            },
            schema: novelSchema,
        }),
        novelsZhTw: defineCollection({
            type: 'page',
            source: {
                include: `novels/${locales.zhTw.dir}/**/*.md`,
                prefix: locales.zhTw.prefix
            },
            schema: novelSchema,
        }),
        novelsEn: defineCollection({
            type: 'page',
            source: {
                include: `novels/${locales.en.dir}/**/*.md`,
                prefix: locales.en.prefix
            },
            schema: novelSchema,
        }),

        seriesZhCn: defineCollection({
            type: 'page',
            source: {
                include: `series/${seriesLocales.zhCn.dir}/**/*.md`,
                prefix: seriesLocales.zhCn.prefix,
            },
            schema: seriesSchema,
        }),
        seriesZhTw: defineCollection({
            type: 'page',
            source: {
                include: `series/${seriesLocales.zhTw.dir}/**/*.md`,
                prefix: seriesLocales.zhTw.prefix,
            },
            schema: seriesSchema,
        }),
        seriesEn: defineCollection({
            type: 'page',
            source: {
                include: `series/${seriesLocales.en.dir}/**/*.md`,
                prefix: seriesLocales.en.prefix,
            },
            schema: seriesSchema,
        }),

        pagesZhCn: defineCollection({
            type: 'page',
            source: {
                include: 'pages/zh-cn/**/*.md',
                prefix: '/'
            },
            schema: pageSchema,
        }),

        pagesZhTw: defineCollection({
            type: 'page',
            source: {
                include: 'pages/zh-tw/**/*.md',
                prefix: '/zh-tw'
            },
            schema: pageSchema,
        }),

        pagesEn: defineCollection({
            type: 'page',
            source: {
                include: 'pages/en/**/*.md',
                prefix: '/en'
            },
            schema: pageSchema,
        }),

        home: defineCollection({
            type: 'data',
            source: 'data/home/*.yml',
            schema: homeSchema,
        }),

        friends: defineCollection({
            type: 'data',
            source: 'data/friends.yml',
            schema: friendsSchema,
        }),
    },
})
