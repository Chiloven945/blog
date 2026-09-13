<script lang="ts" setup>
import type {PostCardItem} from '#shared/types/content'
import PostMeta from './PostMeta.vue'
import PostKindBadge from './PostKindBadge.vue'

defineProps<{
    post: PostCardItem
}>()
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
                    <PostKindBadge :kind="post.kind"/>
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
            </div>
        </NuxtLink>
    </article>
</template>
