export interface CommentsConfig {
    provider: 'giscus'
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
    mapping: 'specific'
    strict: '0' | '1'
    reactionsEnabled: '0' | '1'
    emitMetadata: '0' | '1'
    inputPosition: 'top' | 'bottom'
    loading: 'lazy' | 'eager'
}

export interface SiteConfig {
    name: string
    shortName: string
    /** Compact mark for the floating navigation brand tile. */
    mark: string
    author: string
    domain: string
    since: number
    defaultLocale: string
    defaultLicense: string
    comments: CommentsConfig
}
