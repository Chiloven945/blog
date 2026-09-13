<script lang="ts" setup>
import type {TocLinkLike} from '#shared/types/content'

const props = withDefaults(
    defineProps<{
        links: TocLinkLike[]
        variant?: 'desktop' | 'mobile'
    }>(),
    {
        variant: 'desktop',
    }
)

const {t} = useI18n()
const activeId = ref('')
const navRef = ref<HTMLElement | null>(null)

const flatLinks = computed(() => {
    const result: TocLinkLike[] = []

    const walk = (items: TocLinkLike[]) => {
        for (const item of items) {
            result.push(item)
            if (item.children?.length) {
                walk(item.children)
            }
        }
    }

    walk(props.links)
    return result
})

// Headings sit under the floating nav, so treat everything above this line
// as "already read" when deciding the active section.
const ACTIVATION_OFFSET = 112

function updateActive() {
    let current = ''

    for (const link of flatLinks.value) {
        const element = document.getElementById(link.id)

        if (!element) {
            continue
        }

        if (element.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
            current = link.id
        } else {
            break
        }
    }

    activeId.value = current || flatLinks.value[0]?.id || ''
}

// Keep the active entry centred in the scrollable list. Browsers clamp the
// offset, so a table of contents that fits never moves.
function followActive() {
    const nav = navRef.value

    if (!nav) {
        return
    }

    const active = nav.querySelector<HTMLElement>('a[data-active="true"]')

    if (!active) {
        return
    }

    const navRect = nav.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const offset = (activeRect.top - navRect.top)
        - (navRect.height - activeRect.height) / 2

    nav.scrollTop += offset
}

let frame = 0

function onScroll() {
    if (frame) {
        return
    }

    frame = window.requestAnimationFrame(() => {
        frame = 0
        updateActive()
    })
}

watch(activeId, () => {
    nextTick(followActive)
})

onMounted(() => {
    updateActive()
    followActive()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', updateActive)
})

onBeforeUnmount(() => {
    if (frame) {
        window.cancelAnimationFrame(frame)
    }

    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', updateActive)
})
</script>

<template>
    <nav
            v-if="variant === 'desktop'"
            ref="navRef"
            aria-label="Table of contents"
            class="min-h-0 flex-1 overflow-y-auto"
    >
        <ul class="space-y-0.5">
            <li v-for="link in flatLinks" :key="link.id">
                <a
                        :class="activeId === link.id
                            ? 'border-primary font-medium text-highlighted'
                            : 'border-transparent text-muted hover:text-default'"
                        :data-active="activeId === link.id ? 'true' : 'false'"
                        :href="`#${link.id}`"
                        :style="{paddingLeft: link.depth > 2 ? '1.5rem' : '0.75rem'}"
                        class="-ml-px block border-l-2 py-1 pl-3 text-sm/5 transition-colors"
                >
                    {{ link.text }}
                </a>
            </li>
        </ul>
    </nav>

    <UCollapsible v-else class="lg:hidden">
        <UButton
                :label="t('post.toc')"
                block
                color="neutral"
                trailing-icon="i-lucide-chevron-down"
                variant="ghost"
        />

        <template #content>
            <ul class="mt-2 space-y-0.5 border-s border-default pl-1">
                <li v-for="link in flatLinks" :key="link.id">
                    <a
                            :class="activeId === link.id ? 'text-primary' : 'text-muted hover:text-highlighted'"
                            :href="`#${link.id}`"
                            :style="{paddingLeft: link.depth > 2 ? '1.5rem' : '0.75rem'}"
                            class="block py-1 text-sm transition-colors"
                    >
                        {{ link.text }}
                    </a>
                </li>
            </ul>
        </template>
    </UCollapsible>
</template>
