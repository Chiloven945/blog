import type {SiteConfig} from '../types/site'

export const siteConfig: SiteConfig = {
    name: "Chiloven's Blog",
    shortName: 'CHILOVEN',
    author: 'Chiloven945',
    domain: 'https://www.chiloven.top',
    since: 2024,
    defaultLocale: 'zh-cn',
    defaultLicense: 'CC BY-NC-SA 4.0',
    social: [],
    comments: {
        provider: 'giscus',
        repo: 'Chiloven945/chiloven945.github.io',
        repoId: 'R_kgDOPiijUA',
        category: 'Posts',
        categoryId: 'DIC_kwDOPiijUM4CugC7',
        mapping: 'pathname',
        strict: '0',
        reactionsEnabled: '1',
        emitMetadata: '1',
        inputPosition: 'top',
        loading: 'lazy',
    },
}
