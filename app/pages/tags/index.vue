<script lang="ts" setup>
import TagTile from '~/components/taxonomy/TagTile.vue'

const {t} = useI18n()
const {tags} = await useTagIndex()

usePageMeta({
    title: () => t('tags.title'),
    description: () => t('tags.description'),
})
</script>

<template>
    <div>
        <header class="border-b border-default pb-8">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('tags.label') }}
            </p>
            <h1 class="mt-3 font-display-sans text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                {{ t('tags.title') }}
            </h1>
            <p class="mt-3 max-w-2xl text-base/7 text-muted">
                {{ t('tags.description') }}
            </p>
        </header>

        <div
                v-if="tags.length"
                class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
            <TagTile
                    v-for="tag in tags"
                    :key="tag.key"
                    :tag="tag"
            />
        </div>

        <div
                v-else
                class="mt-10 rounded-sm border border-dashed border-default px-6 py-16 text-center"
        >
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('tags.emptyEyebrow') }}
            </p>
            <p class="mt-3 text-lg font-bold text-highlighted">{{ t('tags.empty') }}</p>
            <p class="mt-2 text-sm text-muted">{{ t('tags.emptyDescription') }}</p>
        </div>
    </div>
</template>
