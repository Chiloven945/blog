export function useMediaQuery(query: string): Ref<boolean> {
    const matches = ref(false)

    if (import.meta.client) {
        const mediaQuery = window.matchMedia(query)

        matches.value = mediaQuery.matches

        const onChange = (event: MediaQueryListEvent) => {
            matches.value = event.matches
        }

        onMounted(() => mediaQuery.addEventListener('change', onChange))
        onBeforeUnmount(() => mediaQuery.removeEventListener('change', onChange))
    }

    return matches
}
