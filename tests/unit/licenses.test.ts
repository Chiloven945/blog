import {describe, expect, it} from 'vitest'
import {licenseKeys, resolveLicense} from '../../shared/config/licenses'

const expectedKeys = [
    'cc-by-4.0',
    'cc-by-sa-4.0',
    'cc-by-nd-4.0',
    'cc-by-nc-4.0',
    'cc-by-nc-sa-4.0',
    'cc-by-nc-nd-4.0',
    'cc0-1.0',
    'public-domain-mark-1.0',
    'all-rights-reserved',
] as const

describe('license registry', () => {
    it('exposes the full CC family plus the public-domain tools', () => {
        expect(licenseKeys).toEqual(expect.arrayContaining([...expectedKeys]))
    })

    it('gives every entry a label', () => {
        for (const key of licenseKeys) {
            expect(resolveLicense(key).label.length, key).toBeGreaterThan(0)
        }
    })

    it('gives every CC entry a deed URL and a local badge', () => {
        for (const key of licenseKeys) {
            if (key === 'all-rights-reserved') {
                continue
            }

            const entry = resolveLicense(key)
            expect(entry.url, key).toContain('creativecommons.org')
            expect(entry.badge, key).toMatch(/^\/images\/licenses\/.+\.svg$/)
        }
    })

    it('falls back to the requested default for unknown keys', () => {
        expect(resolveLicense('not-a-license').label).toBe('CC BY-NC-SA 4.0')
        expect(resolveLicense(undefined, 'all-rights-reserved').label)
            .toBe('All Rights Reserved')
    })
})
