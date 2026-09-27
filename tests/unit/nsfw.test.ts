import {describe, expect, it} from 'vitest'
import {isNsfwPath, nsfwIdentity, stripLocaleFromNsfwPath,} from '../../app/utils/nsfw'

describe('nsfw identity', () => {
    it('strips the locale prefix from an NSFW path', () => {
        expect(stripLocaleFromNsfwPath('/en/nsfw/novels/foo')).toBe('/nsfw/novels/foo')
        expect(stripLocaleFromNsfwPath('/zh-tw/nsfw/articles/bar')).toBe('/nsfw/articles/bar')
        expect(stripLocaleFromNsfwPath('/nsfw/novels/foo')).toBe('/nsfw/novels/foo')
        expect(stripLocaleFromNsfwPath('/en')).toBe('/')
    })

    it('gives the same identity for every locale', () => {
        const ids = ['/en', '/zh-cn', '/zh-tw'].map(locale =>
            nsfwIdentity({path: `${locale}/nsfw/novels/foo`})
        )

        expect(new Set(ids)).toEqual(new Set(['/nsfw/novels/foo']))
    })

    it('recognises only NSFW content paths', () => {
        expect(isNsfwPath('/en/nsfw/articles/x')).toBe(true)
        expect(isNsfwPath('/nsfw')).toBe(true)
        expect(isNsfwPath('/en/articles/x')).toBe(false)
        expect(isNsfwPath('/en/nsfw-data/content/en.json')).toBe(false)
    })
})
