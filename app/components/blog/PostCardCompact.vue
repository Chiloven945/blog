<script lang="ts" setup>
import type {PostCardItem} from '#shared/types/content'
import PostMeta from './PostMeta.vue'
import PostTypeBadge from './PostTypeBadge.vue'

defineProps<{
    post: PostCardItem
}>()
</script>

<template>
    <article class="border-b border-default">
        <NuxtLink
                :to="post.path"
                class="group flex items-center gap-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
            <PostTypeBadge :type="post.type"/>

            <span
                    class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted transition-colors group-hover:text-primary"
            >
                {{ post.title }}
            </span>

            <PostMeta :date="post.date"/>
        </NuxtLink>
    </article>
</template>
