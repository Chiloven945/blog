import {defineCollection, defineContentConfig} from '@nuxt/content'
import {articleSchema} from './shared/schemas/article'
import {linksSchema} from './shared/schemas/links'
import {novelSchema} from './shared/schemas/novel'
import {profileSchema} from './shared/schemas/profile'
import {seriesSchema} from './shared/schemas/series'
import {friendsSchema, pageSchema} from './shared/types/content'

const articles = {
    zhCn: {dir: 'zh-cn', prefix: '/zh-cn/articles'},
    zhTw: {dir: 'zh-tw', prefix: '/zh-tw/articles'},
    en: {dir: 'en', prefix: '/en/articles'},
} as const

const novels = {
    zhCn: {dir: 'zh-cn', prefix: '/zh-cn/novels'},
    zhTw: {dir: 'zh-tw', prefix: '/zh-tw/novels'},
    en: {dir: 'en', prefix: '/en/novels'},
} as const

const seriesLocales = {
    zhCn: {dir: 'zh-cn', prefix: '/zh-cn/series'},
    zhTw: {dir: 'zh-tw', prefix: '/zh-tw/series'},
    en: {dir: 'en', prefix: '/en/series'},
} as const

export default defineContentConfig({
    collections: {
        articlesZhCn: defineCollection({
            type: 'page',
            source: {
                include: `articles/${articles.zhCn.dir}/**/*.md`,
                prefix: articles.zhCn.prefix
            },
            schema: articleSchema,
        }),
        articlesZhTw: defineCollection({
            type: 'page',
            source: {
                include: `articles/${articles.zhTw.dir}/**/*.md`,
                prefix: articles.zhTw.prefix
            },
            schema: articleSchema,
        }),
        articlesEn: defineCollection({
            type: 'page',
            source: {
                include: `articles/${articles.en.dir}/**/*.md`,
                prefix: articles.en.prefix
            },
            schema: articleSchema,
        }),

        novelsZhCn: defineCollection({
            type: 'page',
            source: {
                include: `novels/${novels.zhCn.dir}/**/*.md`,
                prefix: novels.zhCn.prefix
            },
            schema: novelSchema,
        }),
        novelsZhTw: defineCollection({
            type: 'page',
            source: {
                include: `novels/${novels.zhTw.dir}/**/*.md`,
                prefix: novels.zhTw.prefix
            },
            schema: novelSchema,
        }),
        novelsEn: defineCollection({
            type: 'page',
            source: {
                include: `novels/${novels.en.dir}/**/*.md`,
                prefix: novels.en.prefix
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
                prefix: '/zh-cn'
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

        profile: defineCollection({
            type: 'data',
            source: 'data/profile/*.yml',
            schema: profileSchema,
        }),

        links: defineCollection({
            type: 'data',
            source: 'data/links.yml',
            schema: linksSchema,
        }),

        friends: defineCollection({
            type: 'data',
            source: 'data/friends.yml',
            schema: friendsSchema,
        }),
    },
})
