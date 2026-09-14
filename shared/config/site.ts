import type {SiteConfig} from '../types/site'

export const siteConfig: SiteConfig = {
    name: "Chiloven's Blog",
    shortName: 'CHILOVEN',
    mark: '945',
    author: 'Chiloven945',
    domain: 'https://www.chiloven.top',
    since: 2024,
    defaultLocale: 'en',
    defaultLicense: 'cc-by-nc-sa-4.0',
    comments: {
        provider: 'giscus',
        repo: 'Chiloven945/blog',
        repoId: 'R_kgDOUWnNUg',
        category: 'Posts',
        categoryId: 'DIC_kwDOUWnNUs4DFiaR',
        mapping: 'specific',
        strict: '1',
        reactionsEnabled: '1',
        emitMetadata: '0',
        inputPosition: 'top',
        loading: 'lazy',
    },
}
