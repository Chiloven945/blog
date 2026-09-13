<script lang="ts" setup>
import type {NovelDocument} from '#shared/types/novel'
import TaxonomyLink from '~/components/taxonomy/TaxonomyLink.vue'

const props = defineProps<{
    novel: NovelDocument
    readingTime: number
}>()

const {t, locale} = useI18n()

const subtype = computed(() => resolveNovelSubtype(props.novel.subtype))
const status = computed(() => props.novel.status
    ? resolveNovelStatus(props.novel.status)
    : null)
const published = computed(() => formatPostDate(props.novel.date, locale.value))
</script>

<template>
    <header class="novel-title-page px-6 py-20 text-center lg:py-28">
        <figure v-if="novel.cover" class="mx-auto mb-12 max-w-xs">
            <NuxtImg
                    :alt="novel.coverAlt || novel.title"
                    :src="novel.cover"
                    class="w-full rounded-sm border border-default"
                    format="webp"
                    height="600"
                    loading="lazy"
                    width="400"
            />
        </figure>

        <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
            <span class="text-primary">{{ t('novels.kind') }}</span>
            <span v-if="subtype"> / {{ t(subtype.labelKey) }}</span>
        </p>

        <h1
                class="font-display-serif mx-auto mt-8 max-w-3xl text-4xl leading-[1.1] font-bold tracking-tight text-highlighted sm:text-5xl lg:text-6xl"
        >
            {{ novel.title }}
        </h1>

        <p
                v-if="novel.description"
                class="mx-auto mt-7 max-w-xl font-reading-serif text-lg/relaxed text-toned"
        >
            {{ novel.description }}
        </p>

        <div
                class="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.2em] text-muted uppercase"
        >
            <time :datetime="novel.date">{{ published }}</time>

            <template v-if="status">
                <span aria-hidden="true">·</span>
                <span :class="isNovelInProgress(novel.status) ? 'text-primary' : ''">
                    {{ t(status.labelKey) }}
                </span>
            </template>

            <span aria-hidden="true">·</span>
            <span>{{ t('post.readingTime', {minutes: readingTime}) }}</span>
        </div>

        <p v-if="novel.series" class="mt-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">
            {{ novel.series }}
            <template v-if="novel.seriesOrder">
                · {{ t('series.part', {n: String(novel.seriesOrder).padStart(2, '0')}) }}
            </template>
        </p>

        <div
                v-if="novel.tags?.length"
                class="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
        >
            <TaxonomyLink v-for="tag in novel.tags" :key="tag" :tag="tag"/>
        </div>
    </header>
</template>
