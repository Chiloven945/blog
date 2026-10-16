import {describe, expect, it} from 'vitest'
import {isSafeNsfwNext} from '../../app/composables/useNsfwLinkHandoff'

describe('nsfw handoff target validation', () => {
    it('accepts localized, same-origin NSFW paths', () => {
        expect(isSafeNsfwNext('/en/nsfw/articles/x')).toBe(true)
        expect(isSafeNsfwNext('/zh-cn/nsfw/novels/y')).toBe(true)
        expect(isSafeNsfwNext('/zh-tw/nsfw')).toBe(true)
    })

    it('rejects non-NSFW, unprefixed and open-redirect targets', () => {
        expect(isSafeNsfwNext('/en/articles/x')).toBe(false)
        // The canonical NSFW namespace always carries a locale prefix.
        expect(isSafeNsfwNext('/nsfw/articles/x')).toBe(false)
        expect(isSafeNsfwNext('https://evil.example/nsfw')).toBe(false)
        expect(isSafeNsfwNext('//evil.example')).toBe(false)
        expect(isSafeNsfwNext('javascript:alert(1)')).toBe(false)
        expect(isSafeNsfwNext(undefined)).toBe(false)
        expect(isSafeNsfwNext(['/en/nsfw/a'])).toBe(false)
    })
})
