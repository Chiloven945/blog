import {describe, expect, it} from 'vitest'
import {normalizeGiscusTerm} from '../../app/utils/giscus'

describe('normalizeGiscusTerm', () => {
    it(
        'strips a supported locale prefix so all locales share one term',
        () => {
            expect(normalizeGiscusTerm('/en/articles/jep-512')).toBe('/articles/jep-512')
            expect(normalizeGiscusTerm('/zh-cn/articles/jep-512')).toBe('/articles/jep-512')
            expect(normalizeGiscusTerm('/zh-tw/articles/jep-512')).toBe('/articles/jep-512')
        }
    )

    it(
        'keeps the collection segment so article and novel do not collide',
        () => {
            expect(normalizeGiscusTerm('/en/articles/foo')).toBe('/articles/foo')
            expect(normalizeGiscusTerm('/en/novels/foo')).toBe('/novels/foo')
        }
    )

    it(
        'only strips an exact supported locale segment',
        () => {
            expect(normalizeGiscusTerm('/energy/articles/foo')).toBe('/energy/articles/foo')
            expect(normalizeGiscusTerm('/articles/jep-512')).toBe('/articles/jep-512')
        }
    )

    it(
        'removes query, hash and trailing slashes',
        () => {
            expect(normalizeGiscusTerm('/zh-cn/articles/foo/')).toBe('/articles/foo')
            expect(normalizeGiscusTerm('/en/articles/foo?highlight=java#section'))
                .toBe('/articles/foo')
        }
    )

    it(
        'maps a locale root to the site root',
        () => {
            expect(normalizeGiscusTerm('/en')).toBe('/')
            expect(normalizeGiscusTerm('/zh-tw/')).toBe('/')
        }
    )
})
