<script lang="ts" setup>
import TagTile from '~/components/taxonomy/TagTile.vue'
import {hashString, stratifiedShuffle} from '~/utils/shuffle'
import {tagTier, tagTierCount} from '~/utils/tag-tiles'

const {t, locale} = useI18n()
const {tags} = await useTagIndex()

// Stable per-locale shuffle: seeded so server render and hydration match,
// stratified so the large bricks spread across the mosaic.
const orderedTags = computed(() => stratifiedShuffle(
    tags.value,
    tag => tagTier(tag.count),
    tagTierCount,
    hashString(`tags:${locale.value}`),
))

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
                v-if="orderedTags.length"
                class="tag-mosaic mt-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
        >
            <TagTile
                    v-for="(tag, index) in orderedTags"
                    :key="tag.key"
                    :index="index"
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
