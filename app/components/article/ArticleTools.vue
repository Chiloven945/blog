<script lang="ts" setup>
import type {TocLinkLike} from '#shared/types/content'
import ArticleToc from './ArticleToc.vue'

defineProps<{
    links: TocLinkLike[]
}>()

const {t} = useI18n()

const progress = ref(0)
const copied = ref(false)

function updateProgress() {
    const doc = document.documentElement
    const max = doc.scrollHeight - doc.clientHeight
    progress.value = max > 0
        ? Math.min(
            100,
            Math.max(0, (doc.scrollTop / max) * 100)
        )
        : 0
}

async function copyLink() {
    try {
        await navigator.clipboard.writeText(window.location.href)
        copied.value = true
        window.setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch {
        copied.value = false
    }
}

function backToTop() {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion()
            ? 'auto'
            : 'smooth',
    })
}

onMounted(() => {
    updateProgress()
    window.addEventListener('scroll', updateProgress, {passive: true})
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
    <aside class="article-tools sticky top-24 hidden lg:block">
        <div class="flex items-center justify-between font-mono text-xs tracking-[0.2em] text-muted uppercase">
            <span>{{ t('articles.tools') }}</span>
            <span class="tabular-nums">{{ Math.round(progress) }}%</span>
        </div>

        <div class="mt-2 h-0.5 w-full bg-elevated">
            <div
                    :style="{width: `${progress}%`}"
                    class="h-full bg-primary transition-[width] duration-150"
            />
        </div>

        <ArticleToc :links="links" class="mt-6"/>

        <div class="mt-6 flex flex-col items-start gap-1 text-sm">
            <button
                    class="focus-ring inline-flex items-center gap-2 text-muted transition-colors hover:text-highlighted"
                    type="button"
                    @click="copyLink"
            >
                <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-link'" class="size-4"/>
                {{
                    copied
                            ? t('articles.copied')
                            : t('articles.copyLink')
                }}
            </button>

            <button
                    class="focus-ring inline-flex items-center gap-2 text-muted transition-colors hover:text-highlighted"
                    type="button"
                    @click="backToTop"
            >
                <UIcon class="size-4" name="i-lucide-arrow-up"/>
                {{ t('articles.backToTop') }}
            </button>
        </div>
    </aside>
</template>
