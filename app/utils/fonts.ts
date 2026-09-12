/**
 * Per-locale self-hosted font files.
 *
 * Only the files listed here are candidates for <link rel="preload">; the
 * full set of @font-face declarations lives in app/assets/css/typography.css.
 * The active locale's sans is preloaded globally, and the reading face is
 * preloaded per route so the first paint never fetches every CJK font.
 */
export interface LocaleFontFiles {
    /** UI + article reading sans for the locale. */
    sans: string
    /** Novel reading serif for the locale. */
    serif: string
    /** Code face (Cascadia Code, shared by all locales). */
    code: string
}

const codeFile = '/fonts/cascadia-code/CascadiaCode-VF.woff2'

const fontFiles: Record<string, LocaleFontFiles> = {
    'zh-cn': {
        sans: '/fonts/source-han-sans/SourceHanSansCN-VF.woff2',
        serif: '/fonts/source-han-serif/SourceHanSerifCN-VF.woff2',
        code: codeFile,
    },
    'zh-tw': {
        sans: '/fonts/source-han-sans/SourceHanSansTW-VF.woff2',
        serif: '/fonts/source-han-serif/SourceHanSerifTW-VF.woff2',
        code: codeFile,
    },
    en: {
        sans: '/fonts/google-sans-flex/GoogleSansFlex-VF.woff2',
        serif: '/fonts/libre-baskerville/LibreBaskerville-VF.woff2',
        code: codeFile,
    },
}

/** Resolve a locale's font files, falling back to the default locale. */
export function resolveFontFiles(locale?: string): LocaleFontFiles {
    return fontFiles[locale ?? ''] ?? fontFiles['zh-cn']!
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
