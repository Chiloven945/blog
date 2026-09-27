import type {ComputedRef, Ref} from 'vue'

const COOKIE_NAME = 'blog_nsfw'
const BLUR_STORAGE_KEY = 'blog:nsfw-blur'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export interface UseNsfwPreferences {
    hydrated: Readonly<Ref<boolean>>
    enabled: Ref<boolean>
    blur: Ref<boolean>
    effectiveBlur: ComputedRef<boolean>

    enable(): void

    disable(): void

    setBlur(value: boolean): void

    isRevealed(id: string): boolean

    reveal(id: string): void

    hide(id: string): void

    clearRevealed(): void
}

function readCookie(name: string): string | null {
    const match = document.cookie
        .split(';')
        .map(part => part.trim())
        .find(part => part.startsWith(`${name}=`))

    return match
        ? decodeURIComponent(match.slice(name.length + 1))
        : null
}

function writeCookie(enabled: boolean) {
    // Secure cookies cannot be set over plain HTTP, so local development
    // omits the flag.
    const secure = import.meta.dev
        ? ''
        : '; Secure'

    if (enabled) {
        document.cookie = `${COOKIE_NAME}=1; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
    } else {
        document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
    }
}

// Only the first consumer registers the post-hydration restore. `useState`
// keeps the state shared across the settings UI and NSFW surfaces.
let bound = false

export function useNsfwPreferences(): UseNsfwPreferences {
    const hydrated = useState('nsfw-hydrated', () => false)
    const enabled = useState('nsfw-enabled', () => false)
    const blur = useState('nsfw-blur', () => true)
    const revealed = useState<Record<string, boolean>>('nsfw-revealed', () => ({}))

    if (import.meta.client && !bound) {
        bound = true

        // Restore after mount only. The prerendered HTML must always use the
        // safe defaults so the static markup and the client VDOM agree.
        onMounted(() => {
            enabled.value = readCookie(COOKIE_NAME) === '1'

            try {
                const storedBlur = window.localStorage.getItem(BLUR_STORAGE_KEY)
                if (storedBlur !== null) {
                    blur.value = storedBlur === '1'
                }
            } catch {
                // Storage may be unavailable; keep the default blur.
            }

            hydrated.value = true
        })
    }

    const effectiveBlur = computed(() => enabled.value && blur.value)

    function enable() {
        if (import.meta.client) {
            writeCookie(true)
        }

        enabled.value = true
    }

    function disable() {
        if (import.meta.client) {
            writeCookie(false)
        }

        enabled.value = false
        // The cached NSFW metadata/search index is cleared when those caches
        // arrive (NSFW search + content index).
        clearRevealed()
    }

    function setBlur(value: boolean) {
        blur.value = value

        if (import.meta.client) {
            try {
                window.localStorage.setItem(BLUR_STORAGE_KEY,
                    value
                        ? '1'
                        : '0'
                )
            } catch {
                // Storage may be unavailable; the choice then lasts the session.
            }
        }
    }

    function isRevealed(id: string): boolean {
        return revealed.value[id] === true
    }

    function reveal(id: string) {
        if (!isRevealed(id)) {
            revealed.value = {...revealed.value, [id]: true}
        }
    }

    function hide(id: string) {
        if (!isRevealed(id)) {
            return
        }

        revealed.value = Object.fromEntries(
            Object.entries(revealed.value).filter(([key]) => key !== id)
        )
    }

    function clearRevealed() {
        revealed.value = {}
    }

    return {
        hydrated: readonly(hydrated),
        enabled,
        blur,
        effectiveBlur,
        enable,
        disable,
        setBlur,
        isRevealed,
        reveal,
        hide,
        clearRevealed,
    }
}
