<script lang="ts" setup>
import type {NovelCardItem} from '#shared/types/novel'

const props = defineProps<{
    novel: NovelCardItem
}>()

const {t, locale} = useI18n()

const subtype = computed(() => resolveNovelSubtype(props.novel.subtype))
const status = computed(() => props.novel.status
    ? resolveNovelStatus(props.novel.status)
    : null)
const formatted = computed(() => formatPostDate(props.novel.date, locale.value))
</script>

<template>
    <article v-reveal class="reveal reveal--fast border border-default">
        <NuxtLink
                :to="novel.path"
                class="group transition-ui grid gap-8 p-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:p-12"
        >
            <div class="min-w-0">
                <p class="font-mono text-xs tracking-[0.3em] uppercase">
                    <span class="text-primary">{{ t('novels.currentlyWriting') }}</span>
                    <span v-if="subtype" class="text-muted"> / {{ t(subtype.labelKey) }}</span>
                </p>

                <h2
                        class="font-display-serif mt-5 text-3xl leading-[1.15] font-bold tracking-tight text-highlighted transition-colors group-hover:text-primary sm:text-4xl lg:text-5xl"
                >
                    {{ novel.title }}
                </h2>

                <p
                        v-if="novel.description"
                        class="mt-5 max-w-2xl font-reading-serif text-base/7 text-toned"
                >
                    {{ novel.description }}
                </p>

                <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <time :datetime="novel.date">{{ formatted }}</time>
                    <template v-if="status">
                        <span aria-hidden="true">·</span>
                        <span>{{ t(status.labelKey) }}</span>
                    </template>
                </div>
            </div>

            <figure v-if="novel.cover" class="order-first lg:order-last">
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
        </NuxtLink>
    </article>
</template>
