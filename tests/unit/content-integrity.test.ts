import {existsSync, readdirSync, readFileSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {describe, expect, it} from 'vitest'

const root = process.cwd()
const locales = ['en', 'zh-cn', 'zh-tw'] as const

function flatten(
    value: Record<string, unknown>,
    prefix = ''
): Record<string, string> {
    return Object.entries(value).reduce<Record<string, string>>(
        (acc, [key, entry]) => {
            const path = prefix
                ? `${prefix}.${key}`
                : key

            if (entry
                && typeof entry === 'object'
                && !Array.isArray(entry)
            ) {
                Object.assign(
                    acc,
                    flatten(entry as Record<string, unknown>, path)
                )
            } else {
                acc[path] = String(entry)
            }

            return acc
        },
        {}
    )
}

function loadLocale(code: string): Record<string, string> {
    const file = resolve(root, 'i18n/locales', `${code}.json`)
    return flatten(JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>)
}

function statusOf(
    kind: 'articles' | 'novels',
    locale: string,
    file: string
): string | undefined {
    const text = readFileSync(join(root, 'content', kind, locale, file), 'utf8')
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
    const status = /^status:\s*(.+)$/m.exec(match?.[1] ?? '')

    return status?.[1]?.trim().replace(/^["']|["']$/g, '')
}

function publishedSlugs(kind: 'articles' | 'novels', locale: string): string[] {
    return readdirSync(join(root, 'content', kind, locale))
        .filter(name => name.endsWith('.md'))
        .filter(name => statusOf(kind, locale, name) !== 'draft')
        .sort()
}

function referencedImages(): Set<string> {
    const refs = new Set<string>()
    const files = readdirSync(
        join(root, 'content'),
        {recursive: true, encoding: 'utf8'}
    ).filter(name => name.endsWith('.md') || name.endsWith('.yml'))

    for (const name of files) {
        const text = readFileSync(join(root, 'content', name), 'utf8')

        for (const match of text.matchAll(/(?<![\w:])\/images\/[\w./-]+/g)) {
            refs.add(match[0])
        }
    }

    return refs
}

describe(
    'i18n integrity',
    () => {
        const messages = Object.fromEntries(
            locales.map(code => [code, loadLocale(code)]),
        ) as Record<(typeof locales)[number], Record<string, string>>
        const reference = Object.keys(messages.en).sort()

        it(
            'keeps the same message keys in every locale',
            () => {
                expect(reference.length).toBeGreaterThan(20)

                for (const code of locales) {
                    expect(Object.keys(messages[code]).sort(), code).toEqual(reference)
                }
            }
        )

        it(
            'has no empty messages',
            () => {
                for (const code of locales) {
                    for (const [key, value] of Object.entries(messages[code])) {
                        expect(value.trim(), `${code}:${key}`).not.toBe('')
                    }
                }
            }
        )
    }
)

describe('content integrity', () => {
    it(
        'keeps the same published article slugs in every locale',
        () => {
            const reference = publishedSlugs('articles', 'en')

            for (const code of locales) {
                expect(publishedSlugs('articles', code), code).toEqual(reference)
            }
        }
    )

    it(
        'keeps the same published novel slugs in every locale',
        () => {
            const reference = publishedSlugs('novels', 'en')

            for (const code of locales) {
                expect(publishedSlugs('novels', code), code).toEqual(reference)
            }
        }
    )

    it(
        'only references local images that exist under public/',
        () => {
            const missing = [...referencedImages()]
                .filter(path => !existsSync(join(root, 'public', path)))

            expect(missing, 'missing local images').toEqual([])
        }
    )
})
