export interface SocialLink {
    label: string
    icon: string
    to: string
}

export interface SiteConfig {
    name: string
    shortName: string
    author: string
    domain: string
    since: number
    defaultLocale: string
    defaultLicense: string
    social: SocialLink[]
}
