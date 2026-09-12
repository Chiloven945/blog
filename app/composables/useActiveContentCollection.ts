import type {ComputedRef} from 'vue'

export const contentCollections = {
    'zh-cn': {posts: 'postsZhCn', pages: 'pagesZhCn'},
    'zh-tw': {posts: 'postsZhTw', pages: 'pagesZhTw'},
    'en': {posts: 'postsEn', pages: 'pagesEn'},
} as const

export type ContentLocale = keyof typeof contentCollections

export type PostCollectionName = (typeof contentCollections)[ContentLocale]['posts']

export type PageCollectionName = (typeof contentCollections)[ContentLocale]['pages']

export interface ActiveContentCollection {
    posts: PostCollectionName
    pages: PageCollectionName
}

export function resolveContentCollection(locale: string): ActiveContentCollection {
    return contentCollections[locale as ContentLocale] ?? contentCollections['zh-cn']
}

export function useActiveContentCollection(): ComputedRef<ActiveContentCollection> {
    const {locale} = useI18n()

    return computed(() => resolveContentCollection(locale.value))
}
