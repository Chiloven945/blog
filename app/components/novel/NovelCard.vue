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
    <article class="border-b border-default">
        <NuxtLink
                :to="novel.path"
                class="group transition-ui grid gap-4 py-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-10 lg:py-10"
        >
            <div class="min-w-0">
                <p class="font-mono text-[0.6875rem] tracking-[0.3em] text-muted uppercase">
                    <span v-if="subtype">{{ t(subtype.labelKey) }}</span>
                    <span v-if="subtype && status" aria-hidden="true"> · </span>
                    <span
                            v-if="status"
                            :class="isNovelInProgress(novel.status) ? 'text-primary' : ''"
                    >
                        {{ t(status.labelKey) }}
                    </span>
                </p>

                <h3
                        class="font-display-serif mt-3 text-2xl leading-tight font-bold tracking-tight text-highlighted transition-colors group-hover:text-primary sm:text-3xl"
                >
                    {{ novel.title }}
                </h3>

                <p
                        v-if="novel.description"
                        class="mt-3 max-w-2xl font-reading-serif text-base/7 text-toned"
                >
                    {{ novel.description }}
                </p>
            </div>

            <div class="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2 sm:pt-1">
                <time
                        :datetime="novel.date"
                        class="font-mono text-xs tracking-[0.2em] text-muted uppercase"
                >
                    {{ formatted }}
                </time>
                <span
                        v-if="novel.series"
                        class="font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase"
                >
                    {{ novel.series }}
                </span>
            </div>
        </NuxtLink>
    </article>
</template>
