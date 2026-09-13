/**
 * Self-hosted font files that are candidates for <link rel="preload">.
 *
 * The stack is unified and locale-independent (see typography.css):
 * Latin faces are small and safe to preload, while the large CJK fallbacks
 * load on demand via `font-display: swap`. Only one face is preloaded per
 * route: the UI sans globally, plus the reading/code face on post pages.
 */
export interface FontAssets {
    /** UI + article reading Latin sans. */
    sans: string
    /** Novel reading Latin serif. */
    serif: string
    /** Code face. */
    code: string
}

const fontAssets: FontAssets = {
    sans: '/fonts/google-sans-flex/GoogleSansFlex-VF.woff2',
    serif: '/fonts/libre-baskerville/LibreBaskerville-VF.woff2',
    code: '/fonts/cascadia-code/CascadiaCode-VF.woff2',
}

/** The fixed font asset set (kept locale-independent by design). */
export function resolveFontFiles(_locale?: string): FontAssets {
    return fontAssets
}

/** Build a `<link rel="preload">` descriptor for a self-hosted font file. */
export function fontPreloadLink(href: string) {
    return {
        rel: 'preload' as const,
        as: 'font' as const,
        type: 'font/woff2',
        href,
        crossorigin: 'anonymous' as const,
    }
}
