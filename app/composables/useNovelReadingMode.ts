import type {ComputedRef} from 'vue'

/**
 * Pure client-side reading mode for the novel reader (§69).
 *
 * Entering hides the floating navigation and footer and uses the quiet novel
 * surface; Escape exits on desktop, and the reading toolbar always offers an
 * exit control. Fullscreen API is deliberately not used.
 */
export function useNovelReadingMode(): {
    readingMode: ComputedRef<boolean>
    enter: () => void
    exit: () => void
    toggle: () => void
} {
    const readingMode = useState('novel-reading-mode', () => false)

    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && readingMode.value) {
            readingMode.value = false
        }
    }

    if (import.meta.client) {
        onMounted(() => {
            document.documentElement.classList.add('novel-reading')
            document.documentElement.classList.toggle('reading-mode', readingMode.value)
            window.addEventListener('keydown', onKeydown)
        })

        watch(readingMode, value => {
            document.documentElement.classList.toggle('reading-mode', value)
        })

        onBeforeUnmount(() => {
            window.removeEventListener('keydown', onKeydown)
            document.documentElement.classList.remove('novel-reading', 'reading-mode')
            readingMode.value = false
        })
    }

    return {
        readingMode: computed(() => readingMode.value),
        enter: () => {
            readingMode.value = true
        },
        exit: () => {
            readingMode.value = false
        },
        toggle: () => {
            readingMode.value = !readingMode.value
        },
    }
}
