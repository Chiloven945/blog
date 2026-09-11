import {defineCollection, defineContentConfig} from '@nuxt/content'
import {friendsSchema, homeSchema, pageSchema, postSchema} from './shared/types/content'

export default defineContentConfig({
    collections: {
        postsZhCn: defineCollection({
            type: 'page',
            source: {include: 'posts/zh-cn/**/*.md', prefix: '/p'},
            schema: postSchema,
        }),

        postsZhTw: defineCollection({
            type: 'page',
            source: {include: 'posts/zh-tw/**/*.md', prefix: '/zh-tw/p'},
            schema: postSchema,
        }),

        postsEn: defineCollection({
            type: 'page',
            source: {include: 'posts/en/**/*.md', prefix: '/en/p'},
            schema: postSchema,
        }),

        pagesZhCn: defineCollection({
            type: 'page',
            source: {include: 'pages/zh-cn/**/*.md', prefix: '/'},
            schema: pageSchema,
        }),

        pagesZhTw: defineCollection({
            type: 'page',
            source: {include: 'pages/zh-tw/**/*.md', prefix: '/zh-tw'},
            schema: pageSchema,
        }),

        pagesEn: defineCollection({
            type: 'page',
            source: {include: 'pages/en/**/*.md', prefix: '/en'},
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
