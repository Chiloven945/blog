<script lang="ts" setup>
import type {PostCardItem} from '#shared/types/content'
import PostMeta from './PostMeta.vue'
import PostTypeBadge from './PostTypeBadge.vue'

const props = defineProps<{
    post: PostCardItem
}>()

const categories = computed(() => props.post.categories ?? [])
</script>

<template>
    <article class="h-full">
        <NuxtLink
                :to="post.path"
                class="group transition-ui flex h-full flex-col overflow-hidden rounded-sm border border-default bg-default hover:-translate-y-0.5 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
            <div
                    v-if="post.cover"
                    class="aspect-video overflow-hidden border-b border-default bg-elevated"
            >
                <NuxtImg
                        :alt="post.coverAlt || post.title"
                        :src="post.cover"
                        class="h-full w-full object-cover"
                        format="webp"
                        height="360"
                        loading="lazy"
                        width="640"
                />
            </div>

            <div class="flex flex-1 flex-col p-5">
                <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <PostTypeBadge :type="post.type"/>
                    <PostMeta :date="post.date"/>
                </div>

                <h3
                        class="mt-4 text-lg leading-snug font-bold text-highlighted transition-colors group-hover:text-primary"
                >
                    {{ post.title }}
                </h3>

                <p v-if="post.description" class="mt-3 line-clamp-3 text-sm/6 text-muted">
                    {{ post.description }}
                </p>

                <div
                        v-if="categories.length"
                        class="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5 font-mono text-xs tracking-[0.15em] text-muted uppercase"
                >
                    <span v-for="category in categories" :key="category">{{ category }}</span>
                </div>
            </div>
        </NuxtLink>
    </article>
</template>
