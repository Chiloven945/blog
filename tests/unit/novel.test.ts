import {describe, expect, it} from 'vitest'
import {
    isNovelInProgress,
    pickNovelFeature,
    resolveNovelStatus,
    resolveNovelSubtype,
} from '../../app/utils/novel'

describe(
    'novel taxonomy',
    () => {
        it(
            'resolves known subtypes and rejects unknown ones',
            () => {
                expect(resolveNovelSubtype('short-story')).not.toBeNull()
                expect(resolveNovelSubtype('diary')).toBeNull()
                expect(resolveNovelSubtype(undefined)).toBeNull()
            }
        )

        it(
            'resolves statuses, defaulting to complete',
            () => {
                expect(resolveNovelStatus('wip').labelKey).toBe('novel.status.wip')
                expect(resolveNovelStatus(undefined).labelKey).toBe('novel.status.complete')
                expect(resolveNovelStatus('nope').labelKey).toBe('novel.status.complete')
            }
        )

        it(
            'treats only wip as in progress',
            () => {
                expect(isNovelInProgress('wip')).toBe(true)
                expect(isNovelInProgress('complete')).toBe(false)
                expect(isNovelInProgress(undefined)).toBe(false)
            }
        )
    }
)

describe(
    'novel feature',
    () => {
        it(
            'returns null for an empty shelf',
            () => {
                expect(pickNovelFeature([])).toBeNull()
            }
        )

        it(
            'prefers a featured work, then the first serial',
            () => {
                const items = [
                    {path: '/p/a', status: 'complete'},
                    {path: '/p/b', status: 'wip'},
                    {path: '/p/c', status: 'complete', featured: true},
                ]
                expect(pickNovelFeature(items)?.path).toBe('/p/c')
                expect(pickNovelFeature(items.slice(0, 2))?.path).toBe('/p/b')
            }
        )
    }
)
