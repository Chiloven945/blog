import {describe, expect, it} from 'vitest'
import {
    isRelated,
    rankRelated,
    type RelatedCandidate,
    scoreRelated,
} from '../../app/utils/related-score'

function candidate(
    partial: Partial<RelatedCandidate> & { path: string },
): RelatedCandidate {
    return {title: partial.path, date: '2026-01-01', ...partial}
}

describe(
    'related scoring',
    () => {
        it('weights a shared series above a shared tag above a shared subtype', () => {
            const current = candidate({
                path: '/a',
                series: 'jep',
                tags: ['java'],
                subtype: 'translation'
            })
            const sameSeries = candidate({path: '/b', series: 'jep', date: '2020-01-01'})
            const sameTag = candidate({path: '/c', tags: ['java'], date: '2020-01-01'})
            const sameSubtype = candidate({path: '/d', subtype: 'translation', date: '2020-01-01'})

            expect(scoreRelated(current, sameSeries))
                .toBeGreaterThan(scoreRelated(current, sameTag))
            expect(scoreRelated(current, sameTag))
                .toBeGreaterThan(scoreRelated(current, sameSubtype))
        })

        it(
            'compares tags case-insensitively',
            () => {
                const current = candidate({path: '/a', tags: ['Java']})
                const other = candidate({path: '/b', tags: ['java'], date: '2020-01-01'})

                expect(scoreRelated(current, other)).toBe(80)
            }
        )

        it(
            'recognises a relation through series, tag or subtype',
            () => {
                const current = candidate({
                    path: '/a',
                    series: 'jep',
                    tags: ['java'],
                    subtype: 'translation'
                })

                expect(isRelated(current, candidate({path: '/b', series: 'jep'}))).toBe(true)
                expect(isRelated(current, candidate({path: '/c', tags: ['Java']}))).toBe(true)
                expect(isRelated(current, candidate({path: '/d', subtype: 'translation'})))
                    .toBe(true)
                expect(isRelated(current, candidate({path: '/e', tags: ['nuxt']}))).toBe(false)
            }
        )
    }
)

describe(
    'related ranking',
    () => {
        const current = candidate({
            path: '/current',
            tags: ['java'],
            subtype: 'translation',
        })
        const items = [
            candidate({path: '/current', tags: ['java']}),
            candidate({path: '/related', tags: ['java'], subtype: 'translation'}),
            candidate({path: '/draft', tags: ['java'], status: 'draft'}),
            candidate({path: '/stranger', tags: ['nuxt'], featured: true, date: '2026-12-31'}),
        ]

        it(
            'excludes the current work and drafts, and never fills with strangers',
            () => {
                const paths = rankRelated(current, items).map(item => item.path)

                expect(paths).toEqual(['/related'])
            }
        )
    }
)
