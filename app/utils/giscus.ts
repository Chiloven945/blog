const LOCALE_SEGMENTS = new Set(['en', 'zh-cn', 'zh-tw'])

/**
 * Build the locale-neutral Giscus discussion term for a route path.
 *
 *   /en/articles/jep-512
 *   /zh-cn/articles/jep-512   -> /articles/jep-512
 *   /zh-tw/articles/jep-512
 *
 * Only the first path segment is removed, and only when it is exactly one of
 * the supported locales. Article and novel paths keep their own segment, so
 * the same slug in different collections never shares a discussion.
 */
export function normalizeGiscusTerm(pathname: string): string {
    const [path = ''] = pathname
        .split(/[?#]/, 1)
    const segments = path
        .split('/')
        .filter(segment => segment.length > 0)

    if (segments.length > 0 && LOCALE_SEGMENTS.has(segments[0]!)) {
        segments.shift()
    }

    return segments.length > 0
        ? `/${segments.join('/')}`
        : '/'
}
