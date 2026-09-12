import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe, expect, it} from 'vitest'

type Messages = Record<string, unknown>

function flatten(value: Messages, prefix = ''): Record<string, string> {
    return Object.entries(value).reduce<Record<string, string>>((acc, [key, entry]) => {
        const path = prefix ? `${prefix}.${key}` : key

        if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
            Object.assign(acc, flatten(entry as Messages, path))
        } else {
            acc[path] = String(entry)
        }

        return acc
    }, {})
}

function loadLocale(code: string): Record<string, string> {
    const file = resolve(process.cwd(), 'i18n/locales', `${code}.json`)
    return flatten(JSON.parse(readFileSync(file, 'utf8')) as Messages)
}

const locales = {
    'zh-cn': loadLocale('zh-cn'),
    'zh-tw': loadLocale('zh-tw'),
    en: loadLocale('en'),
}

const localeCodes = ['zh-cn', 'zh-tw', 'en'] as const

describe('i18n locale files', () => {
    const referenceKeys = Object.keys(locales['zh-cn']).sort()

    it('exposes a non-trivial message set', () => {
        expect(referenceKeys.length).toBeGreaterThan(20)
    })

    it.each(localeCodes)('%s has the same keyset as zh-cn', (code) => {
        expect(Object.keys(locales[code]).sort()).toEqual(referenceKeys)
    })

    it('has no empty messages in any locale', () => {
        for (const code of localeCodes) {
            for (const [key, value] of Object.entries(locales[code])) {
                expect(value.trim(), `${code}:${key}`).not.toBe('')
            }
        }
    })
})
