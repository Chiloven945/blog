import {describe, expect, it} from 'vitest'
import {
    isNsfwAssetPath,
    isNsfwDataPath,
    isNsfwDocumentPath,
    nsfwEnabled,
    readCookie,
} from '../../worker/index'

describe('worker NSFW gate', () => {
    it('classifies protected NSFW document paths per locale', () => {
        expect(isNsfwDocumentPath('/en/nsfw/articles/x')).toBe(true)
        expect(isNsfwDocumentPath('/zh-cn/nsfw/novels/y')).toBe(true)
        expect(isNsfwDocumentPath('/zh-tw/nsfw')).toBe(true)
        expect(isNsfwDocumentPath('/en/articles/x')).toBe(false)
        expect(isNsfwDocumentPath('/en/nsfw-data/content/en.json')).toBe(false)
        // An unprefixed NSFW path is not a document (data lives under /nsfw-data/).
        expect(isNsfwDocumentPath('/nsfw/articles/x')).toBe(false)
    })

    it('classifies the NSFW data and asset namespaces', () => {
        expect(isNsfwDataPath('/nsfw-data/content/en.json')).toBe(true)
        expect(isNsfwDataPath('/nsfw-data/search/zh-tw.json')).toBe(true)
        expect(isNsfwDataPath('/search-index/en.json')).toBe(false)

        expect(isNsfwAssetPath('/nsfw-assets/novels/lambda/lambda.webp')).toBe(true)
        expect(isNsfwAssetPath('/images/novels/foo.jpg')).toBe(false)
    })

    it('reads a single cookie value from the request header', () => {
        const request = new Request('https://example.com/', {
            headers: {Cookie: 'a=1; blog_nsfw=1; blog_locale=zh-cn'},
        })

        expect(readCookie(request, 'blog_nsfw')).toBe('1')
        expect(readCookie(request, 'blog_locale')).toBe('zh-cn')
        expect(readCookie(request, 'missing')).toBeNull()
        expect(readCookie(new Request('https://example.com/'), 'blog_nsfw')).toBeNull()
    })

    it('treats only blog_nsfw=1 as enabled', () => {
        const enabled = new Request('https://example.com/', {
            headers: {Cookie: 'blog_nsfw=1'},
        })
        const disabled = new Request('https://example.com/', {
            headers: {Cookie: 'blog_nsfw=0'},
        })

        expect(nsfwEnabled(enabled)).toBe(true)
        expect(nsfwEnabled(disabled)).toBe(false)
        expect(nsfwEnabled(new Request('https://example.com/'))).toBe(false)
    })
})
