import {describe, expect, it} from 'vitest'
import {
    decodeTaxonomyParam,
    encodeTaxonomyPath,
    normalizeTagKey,
    tagPath,
} from '../../shared/utils/taxonomy'

describe(
    'taxonomy keys',
    () => {
        it(
            'trims, collapses spaces, and lowercases Latin',
            () => {
                expect(normalizeTagKey('  Java   Concurrency ')).toBe('java concurrency')
                expect(normalizeTagKey('BL')).toBe('bl')
            }
        )

        it(
            'collapses case variants to one key but keeps CJK as-is',
            () => {
                expect(normalizeTagKey('Java')).toBe(normalizeTagKey('java'))
                expect(normalizeTagKey('纯爱')).toBe('纯爱')
            }
        )
    }
)

describe(
    'taxonomy paths',
    () => {
        it(
            'builds tag paths from normalized keys',
            () => {
                expect(tagPath('Java')).toBe('/tags/java')
            }
        )

        it(
            'percent-encodes CJK segments and round-trips them',
            () => {
                const path = tagPath('纯爱')
                expect(path).toBe(`/tags/${encodeTaxonomyPath('纯爱')}`)
                const segment = path.split('/')[2]!
                expect(decodeTaxonomyParam(segment)).toBe('纯爱')
            }
        )
    }
)
