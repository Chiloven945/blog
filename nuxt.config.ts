import {siteConfig} from './shared/config/site'

const localeCodes = ['en', 'zh-cn', 'zh-tw'] as const

// Every indexable page is prerendered to a static file. The feeds and the
// static search indexes have no inbound links during the crawl, so they are
// listed explicitly.
const prerenderSeeds = localeCodes.flatMap(locale => [
    `/${locale}`,
    `/${locale}/articles`,
    `/${locale}/novels`,
    `/${locale}/tags`,
    `/${locale}/archives`,
    `/${locale}/friends`,
    `/${locale}/search`,
    `/${locale}/dev/style`,
    `/${locale}/rss.xml`,
    `/search-index/${locale}.json`,
])

export default defineNuxtConfig({
    compatibilityDate: '2026-09-11',
    devtools: {enabled: true},

    modules: [
        '@nuxt/ui',
        '@nuxt/content',
        '@nuxt/image',
        '@nuxt/fonts',
        '@nuxtjs/i18n',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
        '@nuxt/eslint',
    ],

    css: ['~/assets/css/main.css'],

    content: {
        renderer: {
            alias: {
                // Nuxt UI maps `::callout` to ProseCallout; use our own
                // component so `type`/`title` match the callout API.
                callout: 'Callout',
            },
        },

        build: {
            markdown: {
                // Light + dark Shiki themes. The `dark` key
                // matches Nuxt UI's `.dark` class on <html>.
                highlight: {
                    theme: {
                        default: 'github-light',
                        dark: 'github-dark',
                    },
                    langs: [
                        'java',
                        'kotlin',
                        'groovy',
                        'javascript',
                        'jsx',
                        'tsx',
                        'json',
                        'css',
                        'markdown',
                        'yaml',
                        'xml',
                        'sql',
                        'python',
                        'diff',
                        'shell',
                        'toml',
                    ],
                },
                // GFM is declared explicitly (tables, task lists, and the
                // `[^1]` footnote pipeline) instead of relying on the
                // renderer's transitive defaults.
                remarkPlugins: {
                    'remark-gfm': {},
                    // Math: $inline$ / $$block$$ → KaTeX.
                    'remark-math': {},
                },
                rehypePlugins: {
                    'rehype-katex': {},
                    // External link target/rel is handled by ProseA so the
                    // attributes stay valid (`rel` as a space-separated list).
                    'rehype-external-links': false,
                },
            },
        },
    },

    ui: {
        theme: {
            colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
        },
    },

    fonts: {
        providers: {
            adobe: false,
            fontshare: false,
            fontsource: false,
            google: false,
            googleicons: false,
            npm: false,
        },
    },

    site: {
        url: siteConfig.domain,
        name: siteConfig.name,
    },

    image: {
        // Third-party friend avatars stay remote. Add their
        // hosts here to route them through Nuxt Image; other remote avatars
        // are rendered with <img> so nothing is mirrored without permission.
        domains: [],
    },

    sitemap: {
        // Search results are query-driven and /dev/* is a design reference.
        exclude: [
            '/search',
            '/en/search',
            '/zh-cn/search',
            '/zh-tw/search',
            '/dev/**',
            '/en/dev/**',
            '/zh-cn/dev/**',
            '/zh-tw/dev/**',
        ],
    },

    nitro: {
        // No Cloudflare SSR preset: production is fully prerendered static
        // assets, and a tiny Worker only handles unprefixed entry redirects.
        prerender: {
            crawlLinks: true,
            routes: [
                ...prerenderSeeds,
                '/sitemap.xml',
                '/robots.txt',
            ],
            ignore: [
                // Unprefixed paths are language-entry redirectors only and
                // must never be generated as standalone pages. Nitro matches
                // string ignore entries as path prefixes (a bare '/' would
                // skip every route), so regexes are used to target only the
                // unprefixed page paths without catching /search-index/*,
                // /sitemap.xml or /robots.txt.
                /^\/$/,
                /^\/(articles|novels|tags|archives|friends|dev)(\/|$)/,
                /^\/search$/,
            ],
        },
    },

    i18n: {
        // Every locale carries an explicit URL prefix, including the default
        // (English). Unprefixed paths are language-entry redirectors only.
        strategy: 'prefix',
        defaultLocale: 'en',
        baseUrl: siteConfig.domain,
        locales: [
            {
                code: 'en',
                language: 'en',
                name: 'English',
                file: 'en.json'
            },
            {
                code: 'zh-cn',
                language: 'zh-CN',
                name: '简体中文',
                file: 'zh-cn.json'
            },
            {
                code: 'zh-tw',
                language: 'zh-TW',
                name: '繁體中文',
                file: 'zh-tw.json'
            },
        ],
        // Browser/system language is only consulted for unprefixed entry URLs,
        // where the saved preference wins; explicit locale URLs never change.
        // `alwaysRedirect` must stay false: Nuxt i18n uses it to skip
        // detection on already-prefixed paths, and enabling it makes the
        // client locale middleware rewrite explicit /en|/zh-cn|/zh-tw URLs
        // from the cookie. `redirectOn` is 'root' rather than 'no prefix'
        // because the static 404.html/200.html fallbacks are unprefixed and
        // 'no prefix' turns them into redirect stubs.
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'blog_locale',
            alwaysRedirect: false,
            redirectOn: 'root',
            fallbackLocale: 'en',
        },
    },
})
