<script lang="ts" setup>
import Giscus from '@giscus/vue'
import {siteConfig} from '#shared/config/site'

const {locale} = useI18n()
const colorMode = useColorMode()

const container = ref<HTMLElement | null>(null)
const visible = ref(false)
let observer: IntersectionObserver | null = null

function reveal() {
    visible.value = true
    observer?.disconnect()
    observer = null
}

function attach(el: HTMLElement) {
    if (typeof IntersectionObserver === 'undefined') {
        reveal()
        return
    }

    observer = new IntersectionObserver(
        entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                reveal()
            }
        },
        {rootMargin: '400px 0px'},
    )

    observer.observe(el)
}

// The template ref binds after the first render, which may be later than
// onMounted for client-only components, so watch instead of reading once.
watch(container, el => {
    if (el && !observer && !visible.value) {
        attach(el)
    }
})

onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
})

const theme = computed(() => (colorMode.value === 'dark' ? 'dark' : 'light'))

const giscusLang = computed(() => {
    const map: Record<string, string> = {
        'zh-cn': 'zh-CN',
        'zh-tw': 'zh-TW',
        en: 'en',
    }

    return map[locale.value] ?? 'en'
})

const {comments} = siteConfig
</script>

<template>
    <div ref="container" class="mt-6">
        <Giscus
                v-if="visible"
                :key="`${theme}-${giscusLang}`"
                :category="comments.category"
                :category-id="comments.categoryId"
                :emit-metadata="comments.emitMetadata"
                :input-position="comments.inputPosition"
                :lang="giscusLang"
                :loading="comments.loading"
                :mapping="comments.mapping"
                :reactions-enabled="comments.reactionsEnabled"
                :repo="comments.repo"
                :repo-id="comments.repoId"
                :strict="comments.strict"
                :theme="theme"
        />
    </div>
</template>
