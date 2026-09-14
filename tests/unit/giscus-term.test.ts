import {describe, expect, it} from 'vitest'
import {normalizeGiscusTerm} from '../../app/utils/giscus'

describe(
    'normalizeGiscusTerm',
    () => {
        it(
            'maps every locale of the same content to one discussion term',
            () => {
                expect(normalizeGiscusTerm('/en/articles/jep-512')).toBe('/articles/jep-512')
                expect(normalizeGiscusTerm('/zh-cn/articles/jep-512')).toBe('/articles/jep-512')
                expect(normalizeGiscusTerm('/zh-tw/articles/jep-512')).toBe('/articles/jep-512')
            }
        )

        it(
            'keeps article and novel terms distinct',
            () => {
                expect(normalizeGiscusTerm('/en/articles/foo')).toBe('/articles/foo')
                expect(normalizeGiscusTerm('/en/novels/foo')).toBe('/novels/foo')
            }
        )

        it(
            'normalises trailing slashes, query strings and the locale root',
            () => {
                expect(normalizeGiscusTerm('/zh-cn/articles/foo/')).toBe('/articles/foo')
                expect(normalizeGiscusTerm('/en/articles/foo?highlight=java#section'))
                    .toBe('/articles/foo')
                expect(normalizeGiscusTerm('/en')).toBe('/')
                expect(normalizeGiscusTerm('/energy/articles/foo')).toBe('/energy/articles/foo')
            }
        )
    }
)
