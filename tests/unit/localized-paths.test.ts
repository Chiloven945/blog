import {describe, expect, it} from 'vitest'
import {localizedContentPath, stripLocalePrefix,} from '../../app/composables/useLocaleAvailability'

describe('localized paths', () => {
    it('strips the active locale prefix only', () => {
        expect(stripLocalePrefix('/zh-tw/articles/jep-512', 'zh-tw')).toBe('/articles/jep-512')
        expect(stripLocalePrefix('/zh-cn/articles/jep-512', 'zh-cn')).toBe('/articles/jep-512')
        expect(stripLocalePrefix('/en', 'en')).toBe('/')
        expect(stripLocalePrefix('/blog', 'zh-cn')).toBe('/blog')
        expect(stripLocalePrefix('/energy', 'en')).toBe('/energy')
    })

    it('builds localized target paths', () => {
        expect(localizedContentPath('/articles/jep-512', 'en')).toBe('/en/articles/jep-512')
        expect(localizedContentPath('/articles/jep-512', 'zh-tw')).toBe('/zh-tw/articles/jep-512')
        expect(localizedContentPath('/articles/jep-512', 'zh-cn')).toBe('/zh-cn/articles/jep-512')
        expect(localizedContentPath('/', 'en')).toBe('/en')
    })
})
