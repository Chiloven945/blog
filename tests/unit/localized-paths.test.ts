import {describe, expect, it} from 'vitest'
import {stripLocalePrefix} from '../../app/composables/useLocaleAvailability'

describe('locale prefixes', () => {
    it('strips the active locale prefix only', () => {
        expect(stripLocalePrefix('/zh-tw/articles/jep-512', 'zh-tw')).toBe('/articles/jep-512')
        expect(stripLocalePrefix('/zh-cn/articles/jep-512', 'zh-cn')).toBe('/articles/jep-512')
        expect(stripLocalePrefix('/en', 'en')).toBe('/')
        expect(stripLocalePrefix('/blog', 'zh-cn')).toBe('/blog')
        expect(stripLocalePrefix('/energy', 'en')).toBe('/energy')
    })
})
