import {describe, expect, it} from 'vitest'
import {
    contentCollections,
    resolveContentCollection,
} from '../../app/composables/useActiveContentCollection'
import {localizedContentPath, stripLocalePrefix,} from '../../app/composables/useLocaleAvailability'

describe('content collection selector', () => {
    it('maps each locale to its collections', () => {
        expect(resolveContentCollection('zh-cn')).toEqual({posts: 'postsZhCn', pages: 'pagesZhCn'})
        expect(resolveContentCollection('zh-tw')).toEqual({posts: 'postsZhTw', pages: 'pagesZhTw'})
        expect(resolveContentCollection('en')).toEqual({posts: 'postsEn', pages: 'pagesEn'})
    })

    it('falls back to zh-cn for unknown locales', () => {
        expect(resolveContentCollection('fr')).toEqual(contentCollections['zh-cn'])
    })
})

describe('localized paths', () => {
    it('strips the active locale prefix only', () => {
        expect(stripLocalePrefix('/zh-tw/p/jep-512', 'zh-tw')).toBe('/p/jep-512')
        expect(stripLocalePrefix('/en', 'en')).toBe('/')
        expect(stripLocalePrefix('/blog', 'zh-cn')).toBe('/blog')
        expect(stripLocalePrefix('/energy', 'en')).toBe('/energy')
    })

    it('builds localized target paths', () => {
        expect(localizedContentPath('/p/jep-512', 'en')).toBe('/en/p/jep-512')
        expect(localizedContentPath('/p/jep-512', 'zh-tw')).toBe('/zh-tw/p/jep-512')
        expect(localizedContentPath('/p/jep-512', 'zh-cn')).toBe('/p/jep-512')
        expect(localizedContentPath('/', 'en')).toBe('/')
    })
})
