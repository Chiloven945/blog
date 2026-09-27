// Focused NSFW path/identity helpers. Preference state lives in
// `useNsfwPreferences`; keep this file small.

const nsfwLocalePrefixes = ['en', 'zh-cn', 'zh-tw'] as const

/**
 * Remove the optional locale prefix from a path so the identity of NSFW
 * content is the same no matter which language the reader is using.
 */
export function stripLocaleFromNsfwPath(path: string): string {
    const segments = (path.split(/[?#]/)[0] ?? '')
        .split('/')
        .filter(Boolean)

    if (segments[0] && (nsfwLocalePrefixes as readonly string[]).includes(segments[0])) {
        segments.shift()
    }

    return segments.length === 0
        ? '/'
        : `/${segments.join('/')}`
}

/** Whether a path points at NSFW content (after the optional locale prefix). */
export function isNsfwPath(path: string): boolean {
    const normalized = stripLocaleFromNsfwPath(path)

    return normalized === '/nsfw' || normalized.startsWith('/nsfw/')
}

/** Locale-neutral reveal identity for an NSFW content item. */
export function nsfwIdentity(item: { path: string }): string {
    return stripLocaleFromNsfwPath(item.path)
}
