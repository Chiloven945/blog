import {siteConfig} from './shared/config/site'

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

    // /blog is replaced by /articles; keep the old URLs working as
    // permanent redirects.
    routeRules: {
        '/blog': {
            redirect: {
                to: '/articles',
                statusCode: 301
            }
        },
        '/en/blog': {
            redirect: {
                to: '/en/articles',
                statusCode: 301
            }
        },
        '/zh-tw/blog': {
            redirect: {
                to: '/zh-tw/articles',
                statusCode: 301
            }
        },

        // About and Links are homepage sections in v2; keep the old URLs.
        '/about': {redirect: {to: '/#about', statusCode: 301}},
        '/en/about': {redirect: {to: '/en#about', statusCode: 301}},
        '/zh-tw/about': {redirect: {to: '/zh-tw#about', statusCode: 301}},
        '/links': {redirect: {to: '/#links', statusCode: 301}},
        '/en/links': {redirect: {to: '/en#links', statusCode: 301}},
        '/zh-tw/links': {redirect: {to: '/zh-tw#links', statusCode: 301}},
    },

    sitemap: {
        // Search results are query-driven; the /dev/* routes are temporary.
        exclude: ['/search', '/en/search', '/zh-tw/search', '/dev/**'],
    },

    nitro: {
        prerender: {
            // The feed has no inbound links during the crawl, so list it
            // explicitly. /index.xml is the legacy alias.
            routes: ['/rss.xml', '/index.xml'],
        },
    },

    i18n: {
        strategy: 'prefix_except_default',
        defaultLocale: 'zh-cn',
        baseUrl: siteConfig.domain,
        locales: [
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
            {
                code: 'en',
                language: 'en-US',
                name: 'English',
                file: 'en.json'
            },
        ],
    },
})
