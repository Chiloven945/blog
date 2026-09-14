import {describe, expect, it} from 'vitest'
import {
    decodeTaxonomyParam,
    encodeTaxonomyPath,
    normalizeTagKey,
    tagPath
} from '../../shared/utils/taxonomy'

describe(
    'taxonomy keys',
    () => {
        it(
            'normalises Latin case and spacing, and keeps CJK as-is',
            () => {
                expect(normalizeTagKey('  Java   Concurrency ')).toBe('java concurrency')
                expect(normalizeTagKey('BL')).toBe('bl')
                expect(normalizeTagKey('纯爱')).toBe('纯爱')
            }
        )
    }
)

describe(
    'taxonomy paths',
    () => {
        it(
            'percent-encodes CJK segments and round-trips them',
            () => {
                const path = tagPath('纯爱')

                expect(path).toBe(`/tags/${encodeTaxonomyPath('纯爱')}`)
                expect(decodeTaxonomyParam(path.split('/')[2]!)).toBe('纯爱')
            }
        )
    }
)
