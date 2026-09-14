type Locale = 'en' | 'zh-cn' | 'zh-tw'

interface Env {
    ASSETS: {
        fetch(request: Request): Promise<Response>
    }
}

const LOCALES = new Set<Locale>(['en', 'zh-cn', 'zh-tw'])
const DEFAULT_LOCALE: Locale = 'en'

function readCookie(request: Request, name: string): string | null {
    const header = request.headers.get('Cookie')

    if (!header) {
        return null
    }

    for (const part of header.split(';')) {
        const [rawKey, ...rawValue] = part.trim().split('=')

        if (rawKey === name) {
            return decodeURIComponent(rawValue.join('='))
        }
    }

    return null
}

function asLocale(value: string | null): Locale | null {
    if (!value) {
        return null
    }

    return LOCALES.has(value as Locale)
        ? value as Locale
        : null
}

function browserLocale(header: string | null): Locale | null {
    if (!header) {
        return null
    }

    const preferences = header
        .split(',')
        .map((part, index) => {
            const [rawTag, ...params] = part.trim().split(';')
            const qParam = params.find(param => param.trim().startsWith('q='))
            const parsedQ = qParam
                ? Number.parseFloat(qParam.trim().slice(2))
                : 1

            return {
                tag: rawTag.toLowerCase(),
                q: Number.isFinite(parsedQ)
                    ? parsedQ
                    : 0,
                index,
            }
        })
        .filter(item => item.tag && item.q > 0)
        .sort((a, b) => b.q - a.q || a.index - b.index)

    for (const {tag} of preferences) {
        if (tag === 'en' || tag.startsWith('en-')) {
            return 'en'
        }

        if (tag === 'zh-tw'
            || tag === 'zh-hk'
            || tag === 'zh-mo'
            || tag.includes('hant')) {
            return 'zh-tw'
        }

        if (tag === 'zh'
            || tag === 'zh-cn'
            || tag === 'zh-sg'
            || tag === 'zh-my'
            || tag.includes('hans')
            || tag.startsWith('zh-')) {
            return 'zh-cn'
        }
    }

    return null
}

function alreadyLocalized(pathname: string): boolean {
    return pathname === '/en'
        || pathname.startsWith('/en/')
        || pathname === '/zh-cn'
        || pathname.startsWith('/zh-cn/')
        || pathname === '/zh-tw'
        || pathname.startsWith('/zh-tw/')
}

function looksLikeStaticAsset(pathname: string): boolean {
    if (pathname.startsWith('/_nuxt/')
        || pathname.startsWith('/_ipx/')
        || pathname.startsWith('/images/')
        || pathname.startsWith('/fonts/')) {
        return true
    }

    const last = pathname.split('/').pop() ?? ''

    // `/rss.xml` is intentionally treated as an app entry below.
    if (pathname === '/rss.xml') {
        return false
    }

    return last.includes('.')
}

function redirectLocale(request: Request, locale: Locale): Response {
    const target = new URL(request.url)

    target.pathname = target.pathname === '/'
        ? `/${locale}`
        : `/${locale}${target.pathname}`

    return new Response(null, {
        status: 302,
        headers: {
            Location: target.toString(),
            'Cache-Control': 'private, no-store',
            Vary: 'Cookie, Accept-Language',
        },
    })
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url)

        // A localized path reached the Worker only because no static asset exists.
        // Do not rewrite it to another locale; let it become a real 404.
        if (alreadyLocalized(url.pathname)) {
            return env.ASSETS.fetch(request)
        }

        // Missing physical/static assets are not language pages.
        if (looksLikeStaticAsset(url.pathname)) {
            return env.ASSETS.fetch(request)
        }

        const saved = asLocale(readCookie(request, 'blog_locale'))
        const detected = browserLocale(request.headers.get('Accept-Language'))
        const locale = saved ?? detected ?? DEFAULT_LOCALE

        return redirectLocale(request, locale)
    },
}
