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

function updateActive() {
    let current = ''

    for (const link of flatLinks.value) {
        const element = document.getElementById(link.id)

        if (!element) {
            continue
        }

        if (element.getBoundingClientRect().top <= 112) {
            current = link.id
        } else {
            break
        }
    }

    activeId.value = current || flatLinks.value[0]?.id || ''
}

onMounted(() => {
    updateActive()
    window.addEventListener('scroll', updateActive, {passive: true})
    window.addEventListener('resize', updateActive)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateActive)
    window.removeEventListener('resize', updateActive)
})
</script>

<template>
    <nav
            v-if="variant === 'desktop'"
            aria-label="Table of contents"
            class="max-h-[calc(100vh-var(--ui-header-height)-3rem)] overflow-y-auto"
    >
        <p class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
            {{ t('post.toc') }}
        </p>

        <ul class="mt-3 space-y-0.5">
            <li v-for="link in flatLinks" :key="link.id">
                <a
                        :class="activeId === link.id
                            ? 'border-primary text-highlighted'
                            : 'border-transparent text-muted hover:text-default'"
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
                            :href="`#${link.id}`"
                            :style="{paddingLeft: link.depth > 2 ? '1.5rem' : '0.75rem'}"
                            class="block py-1 text-sm text-muted hover:text-highlighted"
                    >
                        {{ link.text }}
                    </a>
                </li>
            </ul>
        </template>
    </UCollapsible>
</template>
