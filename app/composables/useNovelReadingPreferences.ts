import type {ComputedRef, Ref} from 'vue'

export type NovelFontSize = 's' | 'm' | 'l'
export type NovelLeading = 'compact' | 'normal' | 'airy'
export type NovelWidth = 'narrow' | 'normal' | 'wide'

export interface NovelReadingPreferences {
    size: NovelFontSize
    leading: NovelLeading
    width: NovelWidth
    indent: boolean
}

const STORAGE_KEY = 'blog:novel-reading'

export const novelReadingDefaults: NovelReadingPreferences = {
    size: 'm',
    leading: 'normal',
    width: 'normal',
    indent: true,
}

const fontSizes: Record<NovelFontSize, string> = {
    s: '1rem',
    m: '1.125rem',
    l: '1.3125rem',
}

const leadings: Record<NovelLeading, string> = {
    compact: '1.75',
    normal: '1.95',
    airy: '2.15',
}

const widths: Record<NovelWidth, string> = {
    narrow: '32rem',
    normal: '36rem',
    wide: '42rem',
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function sanitize(value: unknown): NovelReadingPreferences {
    if (!isRecord(value)) {
        return {...novelReadingDefaults}
    }

    return {
        size: value.size === 's' || value.size === 'l'
            ? value.size
            : 'm',
        leading: value.leading === 'compact' || value.leading === 'airy'
            ? value.leading
            : 'normal',
        width: value.width === 'narrow' || value.width === 'wide'
            ? value.width
            : 'normal',
        indent: value.indent !== false,
    }
}

// Only the first call hydrates from and persists to localStorage. `useState`
// keeps the preferences shared across the reader and the toolbar.
let bound = false

export interface UseNovelReadingPreferences {
    prefs: Ref<NovelReadingPreferences>
    /** CSS custom properties applied to the reader shell. */
    style: ComputedRef<Record<string, string>>
}

export function useNovelReadingPreferences(): UseNovelReadingPreferences {
    const prefs = useState<NovelReadingPreferences>(
        'novel-reading-prefs',
        () => ({...novelReadingDefaults})
    )

    if (import.meta.client && !bound) {
        bound = true

        // Hydrate after mount so the first client render matches the server
        // defaults and does not trigger a hydration mismatch.
        onMounted(() => {
            try {
                const raw = window.localStorage.getItem(STORAGE_KEY)
                if (raw) {
                    prefs.value = sanitize(JSON.parse(raw))
                }
            } catch {
                // Ignore unreadable storage and keep the defaults.
            }
        })

        watch(prefs, value => {
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
            } catch {
                // Storage may be unavailable (private mode); preferences then
                // simply last for the session.
            }
        }, {deep: true})
    }

    const style = computed<Record<string, string>>(() => ({
        '--novel-font-size': fontSizes[prefs.value.size],
        '--novel-leading': leadings[prefs.value.leading],
        '--novel-measure': widths[prefs.value.width],
        '--novel-indent': prefs.value.indent
            ? '2em'
            : '0',
    }))

    return {prefs, style}
}
