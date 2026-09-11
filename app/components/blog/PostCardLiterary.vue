<script lang="ts" setup>
import type {PostCardItem} from '#shared/types/content'

const props = defineProps<{
    post: PostCardItem
}>()

const {t, locale} = useI18n()

const typeConfig = computed(() => resolvePostType(props.post.type ?? 'novel'))
const formatted = computed(() => formatPostDate(props.post.date, locale.value))
</script>

<template>
    <article class="col-span-full border-t border-default">
        <NuxtLink
                :to="post.path"
                class="group grid gap-6 py-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-10 lg:py-10"
        >
            <div class="min-w-0">
                <span class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                    {{ t(typeConfig.labelKey) }}
                </span>

                <h3
                        class="mt-4 text-2xl leading-tight font-bold tracking-tight text-highlighted transition-colors group-hover:text-primary sm:text-3xl"
                >
                    {{ post.title }}
                </h3>

                <p v-if="post.description" class="mt-4 max-w-2xl text-base/7 text-muted">
                    {{ post.description }}
                </p>
            </div>

            <div
                    class="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-4 sm:pt-1"
            >
                <time :datetime="post.date"
                      class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                    {{ formatted }}
                </time>
                <span
                        aria-hidden="true"
                        class="text-muted transition-transform group-hover:translate-x-1"
                >
                    →
                </span>
            </div>
        </NuxtLink>
    </article>
</template>
