export interface LicenseConfig {
    /** Language-neutral label (CC licenses and public-domain tools). */
    label: string
    /** Optional i18n key for labels that need translation. */
    labelKey?: string
    /** License or deed page. */
    url?: string
    /** Local badge image, when the license has one. */
    badge?: string
}

function ccLicense(code: string, slug: string, url: string): LicenseConfig {
    return {
        label: `CC ${code}`,
        url,
        badge: `/images/licenses/${slug}.svg`,
    }
}

/**
 * The full Creative Commons license family plus the public-domain tools,
 * using the official press-kit badges. Content picks a key: `license: cc-by-sa-4.0`.
 */
export const licenses = {
    'cc-by-4.0': ccLicense(
        'BY 4.0',
        'by',
        'https://creativecommons.org/licenses/by/4.0/deed.en',
    ),
    'cc-by-sa-4.0': ccLicense(
        'BY-SA 4.0',
        'by-sa',
        'https://creativecommons.org/licenses/by-sa/4.0/deed.en',
    ),
    'cc-by-nd-4.0': ccLicense(
        'BY-ND 4.0',
        'by-nd',
        'https://creativecommons.org/licenses/by-nd/4.0/deed.en',
    ),
    'cc-by-nc-4.0': ccLicense(
        'BY-NC 4.0',
        'by-nc',
        'https://creativecommons.org/licenses/by-nc/4.0/deed.en',
    ),
    'cc-by-nc-sa-4.0': ccLicense(
        'BY-NC-SA 4.0',
        'by-nc-sa',
        'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en',
    ),
    'cc-by-nc-nd-4.0': ccLicense(
        'BY-NC-ND 4.0',
        'by-nc-nd',
        'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en',
    ),
    'cc0-1.0': {
        label: 'CC0 1.0',
        url: 'https://creativecommons.org/publicdomain/zero/1.0/',
        badge: '/images/licenses/cc-zero.svg',
    },
    'public-domain-mark-1.0': {
        label: 'Public Domain Mark 1.0',
        url: 'https://creativecommons.org/publicdomain/mark/1.0/',
        badge: '/images/licenses/publicdomain.svg',
    },
    'all-rights-reserved': {
        label: 'All Rights Reserved',
        labelKey: 'license.allRightsReserved',
    },
} as const satisfies Record<string, LicenseConfig>

export type LicenseKey = keyof typeof licenses

export const licenseKeys = Object.keys(licenses) as [LicenseKey, ...LicenseKey[]]

export const defaultArticleLicense: LicenseKey = 'cc-by-nc-sa-4.0'
export const defaultNovelLicense: LicenseKey = 'all-rights-reserved'

/** Resolve a license key, falling back to the given default. */
export function resolveLicense(
    key: string | undefined,
    fallback: LicenseKey = defaultArticleLicense,
): LicenseConfig {
    return (licenses as Record<string, LicenseConfig>)[key ?? fallback]
        ?? licenses[fallback]
}
