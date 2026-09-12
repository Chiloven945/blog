/**
 * Wrap `prefers-reduced-motion`.
 *
 * `prefersReducedMotion()` is the non-reactive helper used outside of a
 * component instance (for example the reveal directive), while
 * `useMotionPreference()` exposes reactive refs for setup functions.
 */
export function prefersReducedMotion(): boolean {
    return import.meta.client
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useMotionPreference() {
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

    const motionAllowed = computed(() => !reducedMotion.value)

    return {reducedMotion, motionAllowed}
}
