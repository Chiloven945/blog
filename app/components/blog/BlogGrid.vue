<script lang="ts" setup>
import type {PostCardItem} from '#shared/types/content'
import PostCard from './PostCard.vue'

defineProps<{
    posts: PostCardItem[]
}>()
</script>

<template>
    <div v-reveal class="reveal reveal--fast grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="post in posts" :key="post.path" :post="post"/>
    </div>
</template>
