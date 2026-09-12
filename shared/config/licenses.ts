export const licenses = {
    'cc-by-nc-sa-4.0': {
        labelKey: 'license.ccByNcSa',
        label: 'CC BY-NC-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        badge: '/images/licenses/by-nc-sa.svg',
    },
    'all-rights-reserved': {
        labelKey: 'license.allRightsReserved',
        label: 'All Rights Reserved',
    },
} as const

export type LicenseKey = keyof typeof licenses

export const licenseKeys = Object.keys(licenses) as [LicenseKey, ...LicenseKey[]]
