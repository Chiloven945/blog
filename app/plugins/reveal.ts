import type {DirectiveBinding} from 'vue'
import {prefersReducedMotion} from '~/composables/useMotionPreference'

type RevealValue = number | { delay?: number; threshold?: number }

interface RevealElement extends HTMLElement {
    __revealObserver?: IntersectionObserver
}

function resolveOptions(value: RevealValue | undefined) {
    if (typeof value === 'number') {
        return {delay: value, threshold: 0}
    }

    return {delay: value?.delay ?? 0, threshold: value?.threshold ?? 0}
}

/**
 * `v-reveal` — adds `is-revealed` when the element scrolls into view.
 * Pair it with a `.reveal*` class; the styles live in
 * motion.css. Reduced motion and missing IntersectionObserver reveal
 * immediately, so the animation is never required for content.
 */
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive<RevealElement, RevealValue>('reveal', {
        mounted(el, binding: DirectiveBinding<RevealValue>) {
            const {delay, threshold} = resolveOptions(binding.value)

            if (delay) {
                el.style.setProperty('--reveal-delay', `${delay}ms`)
            }

            const reveal = () => el.classList.add('is-revealed')

            if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
                reveal()
                return
            }

            const observer = new IntersectionObserver(
                entries => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            reveal()
                            observer.disconnect()
                            break
                        }
                    }
                },
                {rootMargin: '0px 0px -10% 0px', threshold},
            )

            observer.observe(el)
            el.__revealObserver = observer
        },
        unmounted(el: RevealElement) {
            el.__revealObserver?.disconnect()
            delete el.__revealObserver
        },
    })
})
