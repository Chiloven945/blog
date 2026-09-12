import type {SiteConfig} from '../types/site'

export const siteConfig: SiteConfig = {
    name: "Chiloven's Blog",
    shortName: 'CHILOVEN',
    author: 'Chiloven945',
    domain: 'https://www.chiloven.top',
    since: 2024,
    defaultLocale: 'zh-cn',
    defaultLicense: 'cc-by-nc-sa-4.0',
    social: [
        {
            label: 'GitHub',
            icon: 'i-lucide-github',
            to: 'https://github.com/Chiloven945',
        },
        {
            label: 'Telegram',
            icon: 'i-lucide-send',
            to: 'https://t.me/chiloven945',
        },
        {
            label: 'Underground',
            icon: 'i-lucide-gauge',
            to: 'https://underground.chiloven.top',
        },
        {
            label: 'RSS',
            icon: 'i-lucide-rss',
            to: '/rss.xml',
        },
    ],
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
