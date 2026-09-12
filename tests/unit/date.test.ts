import {describe, expect, it} from 'vitest'
import {formatPostDate, parseDate} from '../../app/utils/date'
import {resolveDateLocale, resolveOgLocale} from '../../app/utils/locale'

describe('date utils', () => {
    it('parses date-only values as UTC midnight', () => {
        const date = parseDate('2026-09-11')
        expect(date.toISOString()).toBe('2026-09-11T00:00:00.000Z')
        expect(date.getUTCFullYear()).toBe(2026)
        expect(date.getUTCMonth()).toBe(8)
        expect(date.getUTCDate()).toBe(11)
    })

    it('parses full ISO timestamps', () => {
        const date = parseDate('2025-11-18T01:54:47+08:00')
        expect(date.toISOString()).toBe('2025-11-17T17:54:47.000Z')
    })

    it('formats dates per locale', () => {
        expect(formatPostDate('2026-09-11', 'en')).toContain('2026')
        expect(formatPostDate('2026-09-11', 'zh-cn')).toContain('2026')
        expect(formatPostDate('2026-09-11', 'zh-tw')).toContain('2026')
    })

    it('keeps an invalid date value as-is', () => {
        expect(formatPostDate('not-a-date', 'en')).toBe('not-a-date')
    })

    it('maps locales for dates and Open Graph', () => {
        expect(resolveDateLocale('zh-cn')).toBe('zh-CN')
        expect(resolveDateLocale('zh-tw')).toBe('zh-TW')
        expect(resolveDateLocale('en')).toBe('en-US')
        expect(resolveOgLocale('zh-tw')).toBe('zh_TW')
        expect(resolveDateLocale('unknown')).toBe('zh-CN')
    })
})
