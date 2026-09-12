import {describe, expect, it} from 'vitest'
import {localizedContentPath, stripLocalePrefix,} from '../../app/composables/useLocaleAvailability'

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
