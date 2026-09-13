import {describe, expect, it} from 'vitest'
import {rankRelated, type RelatedCandidate, scoreRelated} from '../../app/utils/related-score'

function candidate(partial: Partial<RelatedCandidate> & { path: string }): RelatedCandidate {
    return {title: partial.path, date: '2026-01-01', ...partial}
}

describe(
    'related scoring',
    () => {
        it(
            'weights a shared series above a shared tag',
            () => {
                const current = candidate({path: '/p/a', series: 'jep', tags: ['java']})
                const sameSeries = candidate({path: '/p/b', series: 'jep', date: '2020-01-01'})
                const sameTag = candidate({path: '/p/c', tags: ['java'], date: '2020-01-01'})

                expect(scoreRelated(current, sameSeries))
                    .toBeGreaterThan(scoreRelated(current, sameTag))
            }
        )

        it(
            'adds for shared tags and a shared subtype',
            () => {
                const current = candidate({path: '/p/a', tags: ['Java'], subtype: 'translation'})
                const both = candidate({
                    path: '/p/b',
                    tags: ['java'],
                    subtype: 'translation',
                    date: '2020-01-01'
                })
                const tagOnly = candidate({path: '/p/c', tags: ['jep'], date: '2020-01-01'})

                expect(scoreRelated(current, both))
                    .toBeGreaterThan(scoreRelated(current, tagOnly))
            }
        )

        it(
            'normalises tag case',
            () => {
                const current = candidate({path: '/p/a', tags: ['Java']})
                const other = candidate({path: '/p/b', tags: ['java'], date: '2020-01-01'})

                expect(scoreRelated(current, other)).toBe(80)
            }
        )

        it(
            'scores an unrelated older work at zero',
            () => {
                const current = candidate({path: '/p/a', date: '2026-01-01'})
                const other = candidate({path: '/p/b', date: '2020-01-01'})

                expect(scoreRelated(current, other)).toBe(0)
            }
        )
    }
)

describe(
    'related ranking',
    () => {
        const current = candidate({
            path: '/p/current',
            tags: ['java'],
            subtype: 'translation',
            date: '2026-01-01',
        })
        const items = [
            candidate({path: '/p/current', tags: ['java']}),
            candidate({path: '/p/related', tags: ['java'], subtype: 'translation'}),
            candidate({path: '/p/draft', tags: ['java'], status: 'draft'}),
            candidate({path: '/p/other', tags: ['nuxt'], date: '2020-01-01'}),
        ]

        it(
            'excludes the current work and drafts',
            () => {
                const paths = rankRelated(current, items).map(item => item.path)

                expect(paths).not.toContain('/p/current')
                expect(paths).not.toContain('/p/draft')
            }
        )

        it(
            'orders by score and honours the limit',
            () => {
                const ranked = rankRelated(current, items, 1)

                expect(ranked).toHaveLength(1)
                expect(ranked[0]!.path).toBe('/p/related')
            }
        )
    }
)
